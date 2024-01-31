import {FC, useCallback, useEffect, useId, useMemo} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextStyle, ViewStyle} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {HOOK} from '../../hooks/hook';
import {OnEvent, OnStateChangeOptions} from '../../hooks/useOnEvent';
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
    onInnerLayout: (event: LayoutChangeEvent) => void;
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height: number;
        subColor: AnimatedInterpolation;
        titleColor: AnimatedInterpolation;
        width: number;
        innerWidth: number;
        innerHeight: number;
    };
}

export interface CardBaseProps extends CardProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface ProcessEventOptions {
    setState: Updater<typeof initialState>;
}

export type ProcessElevationOptions = Pick<RenderProps, 'type'> & ProcessEventOptions;
export type ProcessLayoutOptions = Pick<RenderProps, 'block' | 'type'> & ProcessEventOptions;
export type ProcessInnerLayoutOptions = Omit<ProcessLayoutOptions, 'type'>;
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
    if (eventName === 'layout') {
        processLayout(event as LayoutChangeEvent, {setState, block});
    }

    processElevation(state, {type, setState});

    setState(draft => {
        draft.eventName = eventName;
    });
};

const initialState = {
    defaultElevation: undefined as ElevationLevel,
    elevation: undefined as ElevationLevel,
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
    status: 'idle' as ComponentStatus,
    innerLayout: {} as LayoutRectangle,
};

export const CardBase: FC<CardBaseProps> = ({
    block,
    disabled,
    titleText = 'Title',
    render,
    type = 'filled',
    primaryButtonLabelText = 'Save',
    secondaryButtonLabelText = 'Cancel',
    primaryButton,
    secondaryButton,
    onPrimaryButtonPress,
    onSecondaryButtonPress,
    ...renderProps
}) => {
    const [{defaultElevation, elevation, eventName, layout, status, innerLayout}, setState] =
        useImmer(initialState);

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

    const [onEvent] = HOOK.useOnEvent({...renderProps, disabled, onStateChange});
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
        if (status !== 'idle') {
            return;
        }

        setState(draft => {
            type === 'elevated' && (draft.defaultElevation = 1);
            draft.status = 'succeeded';
        });
    }, [setState, status, type]);

    useEffect(() => {
        const setElevation = typeof disabled === 'boolean' && type === 'elevated';

        if (!setElevation) {
            return;
        }

        setState(draft => {
            draft.elevation = disabled ? 0 : 1;
        });
    }, [disabled, setState, type]);

    useEffect(() => {
        if (!disabled) {
            return;
        }

        setState(draft => {
            draft.eventName = 'none';
        });
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
