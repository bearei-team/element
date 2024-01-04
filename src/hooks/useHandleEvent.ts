import {useCallback} from 'react';
import {
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    MouseEvent,
    NativeSyntheticEvent,
    PressableProps,
    TargetedEvent,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useImmer} from 'use-immer';
import {EventName, State} from '../components/Common/interface';
import {UTIL} from '../utils/util';

export type Event =
    | GestureResponderEvent
    | MouseEvent
    | NativeSyntheticEvent<TargetedEvent>;

export interface OnEvent {
    onBlur: (event: NativeSyntheticEvent<TargetedEvent>) => void;
    onFocus: (event: NativeSyntheticEvent<TargetedEvent>) => void;
    onHoverIn: (event: MouseEvent) => void;
    onHoverOut: (event: MouseEvent) => void;
    onLongPress: (event: GestureResponderEvent) => void;
    onPress: (event: GestureResponderEvent) => void;
    onPressIn: (event: GestureResponderEvent) => void;
    onPressOut: (event: GestureResponderEvent) => void;
    onLayout: (event: LayoutChangeEvent) => void;
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

const initialState = {
    event: undefined as Event | undefined,
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
    state: 'enabled' as State,
};

export const useHandleEvent = (options: UseHandleEventOptions) => {
    const {
        disabled = false,
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

    const [{state, eventName, event: currentEvent, layout}, setState] =
        useImmer(initialState);

    const theme = useTheme();
    const mobile = ['ios', 'android'].includes(theme.OS);

    const processState = useCallback(
        (nextState: State, processStateOptions = {} as ProcessStateOptions) => {
            if (disabled) {
                return;
            }

            const {
                callback,
                event,
                eventName: processStateEventName,
            } = processStateOptions;

            setState(draft => {
                draft.event = event;
                draft.eventName = processStateEventName;
                draft.state = nextState;
            });

            onStateChange?.(nextState, {
                event,
                eventName: processStateEventName,
            });

            callback?.();
        },
        [disabled, onStateChange, setState],
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

    const processLayout = (event: LayoutChangeEvent) => {
        const nativeEventLayout = event.nativeEvent.layout;

        setState(draft => {
            draft.layout = nativeEventLayout;
        });

        onLayout?.(event);
    };

    const result = {
        event: currentEvent,
        eventName,
        layout,
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
        state,
    };

    return UTIL.omit(result, omitEvents as (keyof typeof result)[]);
};
