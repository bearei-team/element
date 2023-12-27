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
import {EventName, State} from '../components/Common/interface';
import {UTIL} from '../utils/util';

export interface ProcessStateOptions {
    callback?: () => void;
    draft?: typeof initialState;
    event:
        | GestureResponderEvent
        | MouseEvent
        | NativeSyntheticEvent<TargetedEvent>;
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
     * Lock the focus state, e.g. a TextField should not change state after it gets focus until it loses focus
     */
    lockFocusState?: boolean;

    /**
     * Locks the start-press state, e.g. a TextField that enters the start-press state only needs to handle getting focus until it loses focus.
     */
    lockPressInState?: boolean;
};

const initialState = {
    state: 'enabled' as State,
    eventName: 'none' as EventName,
};

export const useHandleEvent = (options: UseHandleEventOptions) => {
    const {
        disabled = false,
        eventState,
        lockFocusState = false,
        lockPressInState = false,
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

    const [{state, eventName}, setState] = useImmer(initialState);
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
                const checkFocusEvent =
                    lockFocusState &&
                    [
                        'hoverIn',
                        'hoverOut',
                        'longPressIn',
                        'press',
                        'pressIn',
                        'pressOut',
                    ].includes(processStateEventName);

                const newState =
                    checkFocusEvent &&
                    draft.state === 'focused' &&
                    processStateEventName !== 'blur'
                        ? draft.state
                        : nextState;

                const updatedState =
                    lockPressInState &&
                    draft.state === 'pressIn' &&
                    !['blur', 'focus'].includes(processStateEventName)
                        ? draft.state
                        : newState;

                onStateChange?.(updatedState, {
                    draft,
                    event,
                    eventName: processStateEventName,
                });

                draft.state = updatedState;
                draft.eventName = processStateEventName;
            });

            callback?.();
        },
        [disabled, lockFocusState, lockPressInState, onStateChange, setState],
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
        eventName,
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
