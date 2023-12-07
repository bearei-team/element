import {useCallback, useEffect} from 'react';
import {
    GestureResponderEvent,
    MouseEvent,
    NativeSyntheticEvent,
    PressableProps,
    TargetedEvent,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useImmer} from 'use-immer';
import {State} from '../components/Common/interface';

export interface ProcessStateOptions {
    callback?: () => void;
    event: GestureResponderEvent | MouseEvent | NativeSyntheticEvent<TargetedEvent>;
    draft?: State;
    eventName:
        | 'blur'
        | 'focus'
        | 'hoverIn'
        | 'hoverOut'
        | 'longPress'
        | 'press'
        | 'pressIn'
        | 'pressOut';
}

export type UseHandleEventOptions = PressableProps & {
    eventState?: State;
    onProcessState?: (nextState: State, options?: ProcessStateOptions) => void;
};

export const useHandleEvent = (options: UseHandleEventOptions) => {
    const {
        onBlur,
        onFocus,
        onHoverIn,
        onHoverOut,
        onPressIn,
        onPressOut,
        onLongPress,
        onPress,
        onProcessState,
        eventState,
    } = options;

    const [state, setState] = useImmer<State>('enabled');
    const theme = useTheme();
    const mobile = ['ios', 'android'].includes(theme.OS);
    const processState = useCallback(
        (nextState: State, processStateOptions = {} as ProcessStateOptions) => {
            const {event, callback, eventName} = processStateOptions;

            setState(draft => {
                const isCheckUpdate = ['hoverIn', 'hoverOut'].includes(eventName);
                const isFocused = draft === 'focused';
                const updatedState = isCheckUpdate && isFocused ? draft : nextState;

                onProcessState?.(updatedState, {event, eventName, draft});

                return updatedState;
            });

            callback?.();
        },
        [onProcessState, setState],
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
            processState('pressed', {
                callback: () => onPress?.(event),
                event,
                eventName: 'press',
            }),
        [onPress, processState],
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

    useEffect(() => {
        eventState && setState(() => eventState);
    }, [eventState, setState]);

    return {
        onBlur: handleBlur,
        onFocus: handleFocus,
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
        onLongPress: handleLongPress,
        onPress: handlePress,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        state,
        mobile,
    };
};
