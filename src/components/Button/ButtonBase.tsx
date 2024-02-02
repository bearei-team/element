import {FC, useCallback, useEffect, useId} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextStyle, ViewStyle} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {HOOK} from '../../hooks/hook';
import {OnEvent, OnStateChangeOptions} from '../../hooks/useOnEvent';
import {ComponentStatus, EventName, State} from '../Common/interface';
import {ElevationLevel} from '../Elevation/Elevation';
import {ButtonProps} from './Button';
import {useAnimated} from './useAnimated';
import {useBorder} from './useBorder';
import {useIcon} from './useIcon';
import {useUnderlayColor} from './useUnderlayColor';

export interface RenderProps extends ButtonProps {
    defaultElevation: ElevationLevel;
    elevation: ElevationLevel;
    eventName: EventName;
    onEvent: OnEvent;
    onContentLayout: (event: LayoutChangeEvent) => void;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height: number;
        width: number;
        contentWidth: number;
        contentHeight: number;
    };
}

export interface ButtonBaseProps extends ButtonProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface ProcessEventOptions {
    setState: Updater<typeof initialState>;
}

export type ProcessElevationOptions = Pick<RenderProps, 'type'> & ProcessEventOptions;
export type ProcessLayoutOptions = Pick<RenderProps, 'type' | 'block'> & ProcessEventOptions;
export type ProcessContentLayoutOptions = Pick<RenderProps, 'block'> & ProcessEventOptions;
export type ProcessStateChangeOptions = OnStateChangeOptions & ProcessLayoutOptions;
export type ProcessDefaultElevationOptions = Pick<RenderProps, 'type'> & ProcessEventOptions;

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

const processContentLayout = (
    event: LayoutChangeEvent,
    {block, setState}: ProcessContentLayoutOptions,
) => {
    if (block) {
        return;
    }

    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.contentLayout = nativeEventLayout;
    });
};

const processStateChange = (
    state: State,
    {event, eventName, type, block, setState}: ProcessStateChangeOptions,
) => {
    eventName === 'layout' && processLayout(event as LayoutChangeEvent, {block, setState});
    processElevation(state, {type, setState});
    setState(draft => {
        draft.eventName = eventName;
    });
};

const processDefaultElevation = (
    status: ComponentStatus,
    {type, setState}: ProcessDefaultElevationOptions,
) =>
    status === 'idle' &&
    setState(draft => {
        type === 'elevated' && (draft.defaultElevation = 1);
        draft.status = 'succeeded';
    });

const processDisabledElevation = (
    {type, setState}: ProcessDefaultElevationOptions,
    disabled?: boolean,
) => {
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

const initialState = {
    contentLayout: {} as LayoutRectangle,
    defaultElevation: undefined as ElevationLevel,
    elevation: undefined as ElevationLevel,
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
    status: 'idle' as ComponentStatus,
};

export const ButtonBase: FC<ButtonBaseProps> = ({
    block,
    disabled,
    icon,
    labelText = 'Label',
    render,
    type = 'filled',
    ...renderProps
}) => {
    const [{contentLayout, defaultElevation, elevation, eventName, layout, status}, setState] =
        useImmer(initialState);

    const id = useId();
    const [underlayColor] = useUnderlayColor({type});
    const onContentLayout = useCallback(
        (event: LayoutChangeEvent) => processContentLayout(event, {block, setState}),
        [block, setState],
    );

    const onStateChange = useCallback(
        (state: State, options = {} as OnStateChangeOptions) =>
            processStateChange(state, {...options, block, type, setState}),
        [block, setState, type],
    );

    const [onEvent] = HOOK.useOnEvent({...renderProps, disabled, onStateChange});
    const [{backgroundColor, borderColor, color}] = useAnimated({disabled, eventName, type});
    const [iconElement] = useIcon({eventName, type, icon, disabled});
    const [border] = useBorder({type, borderColor});

    useEffect(() => {
        processDefaultElevation(status, {type, setState});
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
        icon: iconElement,
        id,
        labelText,
        onContentLayout,
        onEvent,
        type,
        underlayColor,
        renderStyle: {
            ...border,
            backgroundColor,
            color,
            contentHeight: contentLayout.height,
            contentWidth: contentLayout.width,
            height: layout.height,
            width: layout.width,
        },
    });
};
