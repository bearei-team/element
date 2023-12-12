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
import {UTIL} from '../utils/util';

export interface ProcessStateOptions {
    callback?: () => void;
    draft?: State;
    event: GestureResponderEvent | MouseEvent | NativeSyntheticEvent<TargetedEvent>;
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

export type OnStateChangeOptions = Omit<ProcessStateOptions, 'callback'>;
export type UseHandleEventOptions = PressableProps & {
    disabled?: boolean;
    eventState?: State;
    omitEvents?: (keyof UseHandleEventOptions)[];
    onStateChange?: (state: State, options?: OnStateChangeOptions) => void;

    /**
     * To lock the focus state of specific components, for instance,
     * preventing a TextField from changing its state until it loses focus. Meanwhile,
     * components like Buttons should not lock the focus events.
     */
    lockFocusEvent?: boolean;
};

export const useHandleEvent = (options: UseHandleEventOptions) => {
    const {
        disabled = false,
        eventState,
        lockFocusEvent = false,
        omitEvents = [],
        onBlur,
        onFocus,
        onHoverIn,
        onHoverOut,
        onLongPress,
        onPress,
        onPressIn,
        onPressOut,
        onStateChange,
    } = options;

    const [state, setState] = useImmer<State>('enabled');
    const theme = useTheme();
    const mobile = ['ios', 'android'].includes(theme.OS);

    const processState = useCallback(
        (nextState: State, processStateOptions = {} as ProcessStateOptions) => {
            if (disabled) {
                return;
            }

            const {callback, event, eventName} = processStateOptions;

            setState(draft => {
                const checkUpdate =
                    lockFocusEvent &&
                    ['hoverIn', 'hoverOut', 'longPressIn', 'press', 'pressIn', 'pressOut'].includes(
                        eventName,
                    );

                const updatedState =
                    checkUpdate && draft === 'focused' && eventName !== 'blur' ? draft : nextState;

                onStateChange?.(updatedState, {draft, event, eventName});

                return updatedState;
            });

            callback?.();
        },
        [disabled, lockFocusEvent, onStateChange, setState],
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

    const event = {
        mobile,
        onBlur: handleBlur,
        onFocus: handleFocus,
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
        onLongPress: handleLongPress,
        onPress: handlePress,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        state,
    };

    useEffect(() => {
        eventState && setState(() => eventState);
    }, [eventState, setState]);

    return UTIL.omit(event, omitEvents as (keyof typeof event)[]);
};
