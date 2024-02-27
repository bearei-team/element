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

export type Event =
    | GestureResponderEvent
    | LayoutChangeEvent
    | MouseEvent
    | NativeSyntheticEvent<TargetedEvent>;

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

interface ProcessStateOptions {
    callback?: () => void;
    event: Event;
    eventName: EventName;
}

export type OnStateChangeOptions = Omit<ProcessStateOptions, 'callback'>;
interface UseProcessEventOptions extends PressableProps {
    disabled?: boolean;
    onStateChange?: (state: State, options?: OnStateChangeOptions) => void;
}

interface ProcessEventOptions {
    processState: (state: State, options?: ProcessStateOptions) => void;
}

type ProcessStateChangeOptions = Pick<UseProcessEventOptions, 'disabled' | 'onStateChange'>;
type ProcessPressInEventOptions = ProcessEventOptions & Pick<UseProcessEventOptions, 'onPressIn'>;
type ProcessPressEventOptions = ProcessEventOptions &
    Pick<UseProcessEventOptions, 'onPress'> & {mobile: boolean};

type processLongPressEventEventOptions = ProcessEventOptions &
    Pick<UseProcessEventOptions, 'onLongPress'>;

type processPressOutEventEventOptions = ProcessEventOptions &
    Pick<UseProcessEventOptions, 'onPressOut'> & {mobile: boolean};

type processHoverIntEventEventOptions = ProcessEventOptions &
    Pick<UseProcessEventOptions, 'onHoverIn'>;

type processHoverOutEventEventOptions = ProcessEventOptions &
    Pick<UseProcessEventOptions, 'onHoverOut'>;

type processFocusEventEventOptions = ProcessEventOptions & Pick<UseProcessEventOptions, 'onFocus'>;
type ProcessBlurEventOptions = ProcessEventOptions & Pick<UseProcessEventOptions, 'onBlur'>;
type processLayoutEventEventOptions = ProcessEventOptions &
    Pick<UseProcessEventOptions, 'onLayout'>;

const processStateChange = (
    state: State,
    {
        callback,
        event,
        eventName,
        disabled,
        onStateChange,
    }: ProcessStateOptions & ProcessStateChangeOptions,
) => {
    if (disabled && eventName !== 'layout') {
        return;
    }

    onStateChange?.(state, {event, eventName});
    callback?.();
};

const processPressInEvent = (
    event: GestureResponderEvent,
    {processState, onPressIn}: ProcessPressInEventOptions,
) =>
    processState('pressIn', {
        callback: () => onPressIn?.(event),
        event,
        eventName: 'pressIn',
    });

const processPressEvent = (
    event: GestureResponderEvent,
    {processState, onPress, mobile}: ProcessPressEventOptions,
) =>
    processState(mobile ? 'enabled' : 'hovered', {
        callback: () => onPress?.(event),
        event,
        eventName: 'press',
    });

const processLongPressEvent = (
    event: GestureResponderEvent,
    {processState, onLongPress}: processLongPressEventEventOptions,
) =>
    processState('longPressIn', {
        callback: () => onLongPress?.(event),
        event,
        eventName: 'longPress',
    });

const processPressOutEvent = (
    event: GestureResponderEvent,
    {processState, onPressOut, mobile}: processPressOutEventEventOptions,
) =>
    processState(mobile ? 'enabled' : 'hovered', {
        callback: () => onPressOut?.(event),
        event,
        eventName: 'pressOut',
    });

const processHoverIntEvent = (
    event: MouseEvent,
    {processState, onHoverIn}: processHoverIntEventEventOptions,
) => {
    processState('hovered', {
        callback: () => onHoverIn?.(event),
        event,
        eventName: 'hoverIn',
    });
};

const processHoverOutEvent = (
    event: MouseEvent,
    {processState, onHoverOut}: processHoverOutEventEventOptions,
) => {
    processState('enabled', {
        callback: () => onHoverOut?.(event),
        event,
        eventName: 'hoverOut',
    });
};

const processFocusEvent = (
    event: NativeSyntheticEvent<TargetedEvent>,
    {processState, onFocus}: processFocusEventEventOptions,
) =>
    processState('focused', {
        callback: () => onFocus?.(event),
        event,
        eventName: 'focus',
    });

const processBlurEvent = (
    event: NativeSyntheticEvent<TargetedEvent>,
    {processState, onBlur}: ProcessBlurEventOptions,
) =>
    processState('enabled', {
        callback: () => onBlur?.(event),
        event,
        eventName: 'blur',
    });

const processLayoutEvent = (
    event: LayoutChangeEvent,
    {processState, onLayout}: processLayoutEventEventOptions,
) =>
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
}: UseProcessEventOptions) => {
    const theme = useTheme();
    const mobile = ['ios', 'android'].includes(theme.OS);
    const processState = useCallback(
        (state: State, options = {} as ProcessStateOptions) =>
            processStateChange(disabled ? 'disabled' : state, {
                ...options,
                disabled,
                onStateChange,
            }),
        [disabled, onStateChange],
    );

    const processPressIn = useCallback(
        (event: GestureResponderEvent) => processPressInEvent(event, {processState, onPressIn}),
        [onPressIn, processState],
    );

    const processPress = useCallback(
        (event: GestureResponderEvent) => processPressEvent(event, {processState, onPress, mobile}),
        [mobile, onPress, processState],
    );

    const processLongPress = useCallback(
        (event: GestureResponderEvent) => processLongPressEvent(event, {processState, onLongPress}),
        [onLongPress, processState],
    );

    const processPressOut = useCallback(
        (event: GestureResponderEvent) =>
            processPressOutEvent(event, {processState, onPressOut, mobile}),
        [mobile, onPressOut, processState],
    );

    const processHoverIn = useCallback(
        (event: MouseEvent) => processHoverIntEvent(event, {processState, onHoverIn}),
        [onHoverIn, processState],
    );

    const processHoverOut = useCallback(
        (event: MouseEvent) => processHoverOutEvent(event, {processState, onHoverOut}),
        [onHoverOut, processState],
    );

    const processFocus = useCallback(
        (event: NativeSyntheticEvent<TargetedEvent>) =>
            processFocusEvent(event, {processState, onFocus}),
        [onFocus, processState],
    );

    const processBlur = useCallback(
        (event: NativeSyntheticEvent<TargetedEvent>) =>
            processBlurEvent(event, {processState, onBlur}),
        [onBlur, processState],
    );

    const processLayout = useCallback(
        (event: LayoutChangeEvent) => processLayoutEvent(event, {processState, onLayout}),
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
