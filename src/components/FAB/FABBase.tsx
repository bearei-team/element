import {forwardRef, useCallback, useEffect, useId} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {ComponentStatus, EventName, Size, State} from '../Common/interface';
import {ElevationLevel} from '../Elevation/Elevation';
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {useAnimated} from './useAnimated';
import {useIcon} from './useIcon';
import {useUnderlayColor} from './useUnderlayColor';

type FABType = 'surface' | 'primary' | 'secondary' | 'tertiary';
export interface FABProps extends TouchableRippleProps {
    disabled?: boolean;
    elevated?: boolean;
    icon?: React.JSX.Element;
    labelText?: string;
    size?: Size;
    type?: FABType;
}

export interface RenderProps extends FABProps {
    elevation?: ElevationLevel;
    eventName?: EventName;
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height: number;
        width: number;
    };
}

interface FABBaseProps extends FABProps {
    render: (props: RenderProps) => React.JSX.Element;
}

interface InitialState {
    elevation?: ElevationLevel;
    eventName: EventName;
    layout: LayoutRectangle;
    status: ComponentStatus;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessStateChangeOptions = Pick<RenderProps, 'elevated'> &
    ProcessEventOptions &
    OnStateChangeOptions;

type ProcessDisabledElevationOptions = Pick<RenderProps, 'elevated'> & ProcessEventOptions;
type ProcessElevationOptions = Pick<RenderProps, 'elevated'> & ProcessEventOptions;
type ProcessInitOptions = Pick<RenderProps, 'elevated' | 'disabled'> & ProcessEventOptions;

const processElevation = (state: State, {setState, elevated}: ProcessElevationOptions) => {
    if (!elevated) {
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

    setState(draft => {
        draft.elevation = (
            state === 'disabled' ? level[state] : level[state] + 3
        ) as ElevationLevel;
    });
};

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        const update =
            draft.layout.width !== nativeEventLayout.width ||
            draft.layout.height !== nativeEventLayout.height;

        update && (draft.layout = nativeEventLayout);
    });
};

const processStateChange = (
    state: State,
    {event, eventName, elevated, setState}: ProcessStateChangeOptions,
) => {
    eventName === 'layout'
        ? processLayout(event as LayoutChangeEvent, {setState})
        : processElevation(state, {setState, elevated});

    setState(draft => {
        draft.eventName = eventName;
    });
};

const processDisabledElevation = (
    {elevated, setState}: ProcessDisabledElevationOptions,
    disabled?: boolean,
) =>
    typeof disabled === 'boolean' &&
    elevated &&
    setState(draft => {
        draft.elevation = disabled ? 0 : 3;
    });

const processDisabled = ({setState}: ProcessEventOptions, disabled?: boolean) =>
    disabled &&
    setState(draft => {
        draft.eventName = 'none';
    });

const processInit = ({elevated, setState, disabled}: ProcessInitOptions) =>
    setState(draft => {
        if (draft.status !== 'idle') {
            return;
        }

        elevated && !disabled && (draft.elevation = 3);
        draft.status = 'succeeded';
    });

export const FABBase = forwardRef<View, FABBaseProps>(
    ({disabled, elevated = true, icon, render, size, type = 'primary', ...renderProps}, ref) => {
        const [{elevation, layout, eventName, status}, setState] = useImmer<InitialState>({
            elevation: undefined,
            eventName: 'none',
            layout: {} as LayoutRectangle,
            status: 'idle',
        });

        const [underlayColor] = useUnderlayColor({type});
        const id = useId();
        const onStateChange = useCallback(
            (state: State, options = {} as OnStateChangeOptions) =>
                processStateChange(state, {...options, elevated, setState}),
            [elevated, setState],
        );

        const [onEvent] = useOnEvent({...renderProps, disabled, onStateChange});
        const [{backgroundColor, color}] = useAnimated({disabled, type});
        const [iconElement] = useIcon({eventName, type, icon, disabled, size});

        useEffect(() => {
            processInit({elevated, setState, disabled});
            processDisabled({setState}, disabled);
            processDisabledElevation({elevated, setState}, disabled);
        }, [disabled, elevated, setState]);

        if (status === 'idle') {
            return <></>;
        }

        return render({
            ...renderProps,
            elevation,
            eventName,
            icon: iconElement,
            id,
            onEvent,
            ref,
            renderStyle: {
                backgroundColor,
                color,
                height: layout?.height,
                width: layout?.width,
            },
            size,
            type,
            underlayColor,
        });
    },
);
