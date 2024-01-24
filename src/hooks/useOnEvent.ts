import {useMemo} from 'react';
import {
    GestureResponderEvent,
    LayoutChangeEvent,
    MouseEvent,
    NativeSyntheticEvent,
    PressableProps,
    TargetedEvent,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {EventName, State} from '../components/Common/interface';

export type Event =
    | GestureResponderEvent
    | MouseEvent
    | NativeSyntheticEvent<TargetedEvent>
    | LayoutChangeEvent;

export interface OnEvent {
    onBlur: (event: NativeSyntheticEvent<TargetedEvent>) => void;
    onFocus: (event: NativeSyntheticEvent<TargetedEvent>) => void;
    onHoverIn: (event: MouseEvent) => void;
    onHoverOut: (event: MouseEvent) => void;
    onLayout: (event: LayoutChangeEvent) => void;
    onLongPress: (event: GestureResponderEvent) => void;
    onPress: (event: GestureResponderEvent) => void;
    onPressIn: (event: GestureResponderEvent) => void;
    onPressOut: (event: GestureResponderEvent) => void;
}

export interface ProcessStateOptions {
    callback?: () => void;
    event: Event;
    eventName: EventName;
}

export type OnStateChangeOptions = Omit<ProcessStateOptions, 'callback'>;
export type UseHandleEventOptions = PressableProps & {
    disabled?: boolean;

    onStateChange?: (state: State, options?: OnStateChangeOptions) => void;
};

export interface ProcessOptions {
    processState: (nextState: State, options?: ProcessStateOptions) => void;
}

export type ProcessStateChangeOptions = Pick<UseHandleEventOptions, 'disabled' | 'onStateChange'>;
export type ProcessPressInEventOptions = ProcessOptions & Pick<UseHandleEventOptions, 'onPressIn'>;
export type ProcessPressEventOptions = ProcessOptions &
    Pick<UseHandleEventOptions, 'onPress'> & {mobile: boolean};

export type processLongPressEventEventOptions = ProcessOptions &
    Pick<UseHandleEventOptions, 'onLongPress'>;
export type processPressOutEventEventOptions = ProcessOptions &
    Pick<UseHandleEventOptions, 'onPressOut'> & {mobile: boolean};

export type processHoverIntEventEventOptions = ProcessOptions &
    Pick<UseHandleEventOptions, 'onHoverIn'>;
export type processHoverOutEventEventOptions = ProcessOptions &
    Pick<UseHandleEventOptions, 'onHoverOut'>;
export type processFocusEventEventOptions = ProcessOptions & Pick<UseHandleEventOptions, 'onFocus'>;
export type ProcessBlurEventOptions = ProcessOptions & Pick<UseHandleEventOptions, 'onBlur'>;
export type processLayoutEventEventOptions = ProcessOptions &
    Pick<UseHandleEventOptions, 'onLayout'>;

const processStateChange =
    ({disabled, onStateChange}: ProcessStateChangeOptions) =>
    (nextState: State, {callback, event, eventName} = {} as ProcessStateOptions) => {
        if (disabled && eventName !== 'layout') {
            return;
        }

        onStateChange?.(nextState, {event, eventName});
        callback?.();
    };

const processPressInEvent =
    ({processState, onPressIn}: ProcessPressInEventOptions) =>
    (event: GestureResponderEvent) =>
        processState('pressIn', {
            callback: () => onPressIn?.(event),
            event,
            eventName: 'pressIn',
        });

const processPressEvent =
    ({processState, onPress, mobile}: ProcessPressEventOptions) =>
    (event: GestureResponderEvent) =>
        processState(mobile ? 'enabled' : 'hovered', {
            callback: () => onPress?.(event),
            event,
            eventName: 'press',
        });

const processLongPressEvent =
    ({processState, onLongPress}: processLongPressEventEventOptions) =>
    (event: GestureResponderEvent) =>
        processState('longPressIn', {
            callback: () => onLongPress?.(event),
            event,
            eventName: 'longPress',
        });

const processPressOutEvent =
    ({processState, onPressOut, mobile}: processPressOutEventEventOptions) =>
    (event: GestureResponderEvent) =>
        processState(mobile ? 'enabled' : 'hovered', {
            callback: () => onPressOut?.(event),
            event,
            eventName: 'pressOut',
        });

const processHoverIntEvent =
    ({processState, onHoverIn}: processHoverIntEventEventOptions) =>
    (event: MouseEvent) => {
        processState('hovered', {
            callback: () => onHoverIn?.(event),
            event,
            eventName: 'hoverIn',
        });
    };

const processHoverOutEvent =
    ({processState, onHoverOut}: processHoverOutEventEventOptions) =>
    (event: MouseEvent) => {
        processState('enabled', {
            callback: () => onHoverOut?.(event),
            event,
            eventName: 'hoverOut',
        });
    };

const processFocusEvent =
    ({processState, onFocus}: processFocusEventEventOptions) =>
    (event: NativeSyntheticEvent<TargetedEvent>) =>
        processState('focused', {
            callback: () => onFocus?.(event),
            event,
            eventName: 'focus',
        });

const processBlurEvent =
    ({processState, onBlur}: ProcessBlurEventOptions) =>
    (event: NativeSyntheticEvent<TargetedEvent>) =>
        processState('enabled', {
            callback: () => onBlur?.(event),
            event,
            eventName: 'blur',
        });

const processLayoutEvent =
    ({processState, onLayout}: processLayoutEventEventOptions) =>
    (event: LayoutChangeEvent) =>
        processState('enabled', {
            callback: () => onLayout?.(event),
            event,
            eventName: 'layout',
        });

export const useOnEvent = ({
    disabled,
    onBlur,
    onFocus,
    onHoverIn,
    onHoverOut,
    onLayout,
    onLongPress,
    onPress,
    onPressIn,
    onPressOut,
    onStateChange,
}: UseHandleEventOptions) => {
    const theme = useTheme();
    const mobile = ['ios', 'android'].includes(theme.OS);
    const processState = useMemo(
        () => processStateChange({disabled, onStateChange}),
        [disabled, onStateChange],
    );

    const processPressIn = useMemo(
        () => processPressInEvent({processState, onPressIn}),
        [onPressIn, processState],
    );

    const processPress = useMemo(
        () => processPressEvent({processState, onPress, mobile}),
        [mobile, onPress, processState],
    );

    const processLongPress = useMemo(
        () => processLongPressEvent({processState, onLongPress}),
        [onLongPress, processState],
    );

    const processPressOut = useMemo(
        () => processPressOutEvent({processState, onPressOut, mobile}),
        [mobile, onPressOut, processState],
    );

    const processHoverIn = useMemo(
        () => processHoverIntEvent({processState, onHoverIn}),
        [onHoverIn, processState],
    );

    const processHoverOut = useMemo(
        () => processHoverOutEvent({processState, onHoverOut}),
        [onHoverOut, processState],
    );

    const processFocus = useMemo(
        () => processFocusEvent({processState, onFocus}),
        [onFocus, processState],
    );

    const processBlur = useMemo(
        () => processBlurEvent({processState, onBlur}),
        [onBlur, processState],
    );

    const processLayout = useMemo(
        () => processLayoutEvent({processState, onLayout}),
        [onLayout, processState],
    );

    return [
        {
            mobile,
            onBlur: processBlur,
            onFocus: processFocus,
            onHoverIn: processHoverIn,
            onHoverOut: processHoverOut,
            onLayout: processLayout,
            onLongPress: processLongPress,
            onPress: processPress,
            onPressIn: processPressIn,
            onPressOut: processPressOut,
        },
    ];
};
