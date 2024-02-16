import {FC, useCallback, useEffect, useId, useMemo} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextStyle, ViewStyle} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {Button} from '../Button/Button';
import {AnimatedInterpolation, ComponentStatus, EventName, State} from '../Common/interface';
import {ElevationLevel} from '../Elevation/Elevation';
import {CardProps} from './Card';
import {useAnimated} from './useAnimated';
import {useBorder} from './useBorder';
import {useUnderlayColor} from './useUnderlayColor';

export interface RenderProps extends CardProps {
    defaultElevation: ElevationLevel;
    elevation: ElevationLevel;
    eventName: EventName;
    onEvent: OnEvent;
    onInnerLayout: (event: LayoutChangeEvent) => void;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height: number;
        innerHeight: number;
        innerWidth: number;
        subColor: AnimatedInterpolation;
        titleColor: AnimatedInterpolation;
        width: number;
    };
}

export interface CardBaseProps extends CardProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface InitialState {
    defaultElevation?: ElevationLevel;
    elevation?: ElevationLevel;
    eventName: EventName;
    innerLayout: LayoutRectangle;
    layout: LayoutRectangle;
    status: ComponentStatus;
}

export interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

export type ProcessElevationOptions = Pick<RenderProps, 'type'> & ProcessEventOptions;
export type ProcessInitOptions = Pick<RenderProps, 'type'> & ProcessEventOptions;
export type ProcessInnerLayoutOptions = Omit<ProcessLayoutOptions, 'type'>;
export type ProcessLayoutOptions = Pick<RenderProps, 'block' | 'type'> & ProcessEventOptions;
export type ProcessStateChangeOptions = OnStateChangeOptions & ProcessLayoutOptions;

const processCorrectionCoefficient = ({type}: Pick<RenderProps, 'type'>) =>
    type === 'elevated' ? 1 : 0;

const processElevation = (state: State, {type = 'filled', setState}: ProcessElevationOptions) => {
    const elevationType = ['elevated', 'filled', 'tonal'].includes(type);

    if (!elevationType) {
        return;
    }

    const level = {
        disabled: 0,
        enabled: 0,
        error: 0,
        focused: 0,
        hovered: 1,
        longPressIn: 0,
        pressIn: 0,
    };

    const correctionCoefficient = processCorrectionCoefficient({type});

    setState(draft => {
        draft.elevation = (level[state] + correctionCoefficient) as ElevationLevel;
    });
};

const processLayout = (event: LayoutChangeEvent, {block, setState}: ProcessLayoutOptions) => {
    if (!block) {
        return;
    }

    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processInnerLayout = (
    event: LayoutChangeEvent,
    {block, setState}: ProcessInnerLayoutOptions,
) => {
    if (block) {
        return;
    }

    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.innerLayout = nativeEventLayout;
    });
};

const processStateChange = (
    state: State,
    {event, eventName, type, setState, block}: ProcessStateChangeOptions,
) => {
    eventName === 'layout' && processLayout(event as LayoutChangeEvent, {setState, block});
    processElevation(state, {type, setState});
    setState(draft => {
        draft.eventName = eventName;
    });
};

const processInit = (status: ComponentStatus, {type, setState}: ProcessInitOptions) =>
    status === 'idle' &&
    setState(draft => {
        type === 'elevated' && (draft.defaultElevation = 1);
        draft.status = 'succeeded';
    });

const processDisabledElevation = ({type, setState}: ProcessInitOptions, disabled?: boolean) => {
    const setElevation = typeof disabled === 'boolean' && type === 'elevated';

    setElevation &&
        setState(draft => {
            draft.elevation = disabled ? 0 : 1;
        });
};

const processDisabled = ({setState}: ProcessEventOptions, disabled?: boolean) =>
    disabled &&
    setState(draft => {
        draft.eventName = 'none';
    });

export const CardBase: FC<CardBaseProps> = ({
    block,
    disabled,
    onPrimaryButtonPress,
    onSecondaryButtonPress,
    primaryButton,
    primaryButtonLabelText = 'Save',
    render,
    secondaryButton,
    secondaryButtonLabelText = 'Cancel',
    titleText = 'Title',
    type = 'filled',
    ...renderProps
}) => {
    const [{defaultElevation, elevation, eventName, layout, status, innerLayout}, setState] =
        useImmer<InitialState>({
            defaultElevation: undefined,
            elevation: undefined,
            eventName: 'none',
            innerLayout: {} as LayoutRectangle,
            layout: {} as LayoutRectangle,
            status: 'idle',
        });

    const id = useId();
    const [underlayColor] = useUnderlayColor({type});
    const onInnerLayout = useCallback(
        (event: LayoutChangeEvent) => processInnerLayout(event, {block, setState}),
        [block, setState],
    );

    const onStateChange = useCallback(
        (state: State, options = {} as OnStateChangeOptions) =>
            processStateChange(state, {...options, type, block, setState}),
        [block, setState, type],
    );

    const [onEvent] = useOnEvent({...renderProps, disabled, onStateChange});
    const [{backgroundColor, borderColor, titleColor, subColor}] = useAnimated({
        disabled,
        eventName,
        type,
    });

    const [border] = useBorder({type, borderColor});
    const primaryButtonElement = useMemo(
        () =>
            primaryButton ?? (
                <Button
                    disabled={disabled}
                    labelText={primaryButtonLabelText}
                    onPress={onPrimaryButtonPress}
                    type="filled"
                />
            ),
        [disabled, onPrimaryButtonPress, primaryButton, primaryButtonLabelText],
    );

    const secondaryButtonElement = useMemo(
        () =>
            secondaryButton ?? (
                <Button
                    disabled={disabled}
                    labelText={secondaryButtonLabelText}
                    onPress={onSecondaryButtonPress}
                    type="outlined"
                />
            ),
        [disabled, onSecondaryButtonPress, secondaryButton, secondaryButtonLabelText],
    );

    useEffect(() => {
        processInit(status, {setState, type});
    }, [setState, status, type]);

    useEffect(() => {
        processDisabledElevation({setState, type}, disabled);
    }, [disabled, setState, type]);

    useEffect(() => {
        processDisabled({setState}, disabled);
    }, [disabled, setState]);

    if (status === 'idle') {
        return <></>;
    }

    return render({
        ...renderProps,
        block,
        defaultElevation,
        disabled,
        elevation,
        eventName,
        id,
        onEvent,
        onInnerLayout,
        primaryButton: primaryButtonElement,
        secondaryButton: secondaryButtonElement,
        titleText,
        type,
        underlayColor,
        renderStyle: {
            ...border,
            backgroundColor,
            borderColor,
            height: layout.height,
            subColor,
            titleColor,
            width: layout.width,
            innerHeight: innerLayout.height,
            innerWidth: innerLayout.width,
        },
    });
};
