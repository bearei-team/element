import {useCallback} from 'react';
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
import {UTIL} from '../utils/util';

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
    omitEvents?: (keyof UseHandleEventOptions)[];
    onStateChange?: (state: State, options?: OnStateChangeOptions) => void;
};

export const useOnEvent = (options: UseHandleEventOptions) => {
    const {
        disabled,
        omitEvents = [],
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
    } = options;

    const theme = useTheme();
    const mobile = ['ios', 'android'].includes(theme.OS);
    const processState = useCallback(
        (nextState: State, processStateOptions = {} as ProcessStateOptions) => {
            const {callback, event, eventName: processStateEventName} = processStateOptions;

            if (disabled && processStateEventName !== 'layout') {
                return;
            }

            onStateChange?.(nextState, {
                event,
                eventName: processStateEventName,
            });

            callback?.();
        },
        [disabled, onStateChange],
    );

    const handlePressIn = useCallback(
        (event: GestureResponderEvent) =>
            processState('pressIn', {
                callback: () => onPressIn?.(event),
                event,
                eventName: 'pressIn',
            }),
        [onPressIn, processState],
    );

    const handlePress = useCallback(
        (event: GestureResponderEvent) =>
            processState(mobile ? 'enabled' : 'hovered', {
                callback: () => onPress?.(event),
                event,
                eventName: 'press',
            }),
        [mobile, onPress, processState],
    );

    const handleLongPress = useCallback(
        (event: GestureResponderEvent) =>
            processState('longPressIn', {
                callback: () => onLongPress?.(event),
                event,
                eventName: 'longPress',
            }),
        [onLongPress, processState],
    );

    const handlePressOut = useCallback(
        (event: GestureResponderEvent) =>
            processState(mobile ? 'enabled' : 'hovered', {
                callback: () => onPressOut?.(event),
                event,
                eventName: 'pressOut',
            }),
        [mobile, onPressOut, processState],
    );

    const handleHoverIn = useCallback(
        (event: MouseEvent) => {
            processState('hovered', {
                callback: () => onHoverIn?.(event),
                event,
                eventName: 'hoverIn',
            });
        },
        [onHoverIn, processState],
    );

    const handleHoverOut = useCallback(
        (event: MouseEvent) => {
            processState('enabled', {
                callback: () => onHoverOut?.(event),
                event,
                eventName: 'hoverOut',
            });
        },
        [onHoverOut, processState],
    );

    const handleFocus = useCallback(
        (event: NativeSyntheticEvent<TargetedEvent>) =>
            processState('focused', {
                callback: () => onFocus?.(event),
                event,
                eventName: 'focus',
            }),
        [onFocus, processState],
    );

    const handleBlur = useCallback(
        (event: NativeSyntheticEvent<TargetedEvent>) =>
            processState('enabled', {
                callback: () => onBlur?.(event),
                event,
                eventName: 'blur',
            }),
        [onBlur, processState],
    );

    const processLayout = useCallback(
        (event: LayoutChangeEvent) =>
            processState('enabled', {
                callback: () => onLayout?.(event),
                event,
                eventName: 'layout',
            }),
        [onLayout, processState],
    );

    const result = {
        mobile,
        onBlur: handleBlur,
        onFocus: handleFocus,
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
        onLayout: processLayout,
        onLongPress: handleLongPress,
        onPress: handlePress,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
    };

    return [UTIL.omit(result, omitEvents as (keyof typeof result)[])];
};
