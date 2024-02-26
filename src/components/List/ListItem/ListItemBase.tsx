import {FC, useCallback, useEffect, useId, useMemo} from 'react';
import {
    Animated,
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    NativeTouchEvent,
    ViewStyle,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../../hooks/useOnEvent';
import {AnimatedInterpolation, ComponentStatus, EventName, State} from '../../Common/interface';
import {Icon} from '../../Icon/Icon';
import {IconButton} from '../../IconButton/IconButton';
import {TouchableRippleProps} from '../../TouchableRipple/TouchableRipple';
import {useAnimated} from './useAnimated';

export interface ListItemProps extends TouchableRippleProps {
    activeKey?: string;
    close?: boolean;
    defaultActiveKey?: string;
    gap?: number;
    headline?: string;
    indexKey?: string;
    leading?: React.JSX.Element;
    onActive?: (key?: string) => void;
    onClose?: (key?: string) => void;
    supportingText?: string;
    supportingTextNumberOfLines?: number;
    trailing?: React.JSX.Element;
}

export interface RenderProps extends ListItemProps {
    active?: boolean;
    activeColor: string;
    activeLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    defaultActive?: boolean;
    eventName: EventName;
    onEvent: OnEvent;
    rippleCentered?: boolean;
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        height: number;
        trailingOpacity: AnimatedInterpolation;
        containerHeight: AnimatedInterpolation;
        width: number;
    };
    underlayColor: string;
}

interface ListItemBaseProps extends ListItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

interface InitialState {
    activeLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    eventName: EventName;
    layout: LayoutRectangle;
    rippleCentered: boolean;
    state: State;
    status: ComponentStatus;
    trailingEventName: EventName;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessPressOutOptions = Pick<RenderProps, 'activeKey' | 'indexKey' | 'onActive'> &
    ProcessEventOptions;

type ProcessTrailingEventOptions = {callback?: () => void} & ProcessEventOptions;
type ProcessTrailingPressOutOptions = Pick<RenderProps, 'close' | 'indexKey' | 'onClose'> & {
    onCloseAnimated: (finished?: (() => void) | undefined) => void;
} & ProcessEventOptions;

type ProcessStateChangeOptions = OnStateChangeOptions & ProcessPressOutOptions;
type ProcessInitOptions = ProcessEventOptions & Pick<RenderProps, 'defaultActive'>;
type ProcessActiveOptions = ProcessEventOptions & Pick<RenderProps, 'active'>;

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processPressOut = (
    event: GestureResponderEvent,
    {activeKey, indexKey, onActive, setState}: ProcessPressOutOptions,
) => {
    if (activeKey === indexKey) {
        return;
    }

    const {locationX = 0, locationY = 0} = event.nativeEvent;

    setState(draft => {
        draft.activeLocation = {locationX, locationY};
        draft.rippleCentered = false;
    });

    onActive?.(indexKey);
};

const processStateChange = (
    state: State,
    {event, eventName, activeKey, indexKey, onActive, setState}: ProcessStateChangeOptions,
) => {
    const nextEvent = {
        layout: () => processLayout(event as LayoutChangeEvent, {setState}),
        pressOut: () =>
            processPressOut(event as GestureResponderEvent, {
                activeKey,
                indexKey,
                onActive,
                setState,
            }),
    };

    nextEvent[eventName as keyof typeof nextEvent]?.();

    setState(draft => {
        draft.eventName = eventName;
        draft.state = state;
    });
};

const processTrailingEvent = (
    eventName: EventName,
    {callback, setState}: ProcessTrailingEventOptions,
) => {
    setState(draft => {
        draft.trailingEventName = eventName;
    });

    callback?.();
};

const processTrailingPressOut = ({
    close,
    indexKey,
    onCloseAnimated,
    onClose,
}: ProcessTrailingPressOutOptions) => close && onCloseAnimated?.(() => onClose?.(indexKey));

const processTrailingHoverIn = ({setState}: ProcessEventOptions) =>
    processTrailingEvent('hoverIn', {setState});

const processTrailingHoverOut = ({setState}: ProcessEventOptions) =>
    processTrailingEvent('hoverOut', {setState});

const processInit = ({defaultActive, setState}: ProcessInitOptions) => {
    setState(draft => {
        if (draft.status !== 'idle') {
            return;
        }

        draft.rippleCentered = !!defaultActive;
        draft.status = 'succeeded';
    });
};

const processActive = ({setState, active}: ProcessActiveOptions) =>
    active &&
    setState(draft => {
        if (draft.status !== 'succeeded' || draft.activeLocation?.locationX) {
            return;
        }

        draft.rippleCentered = true;
        draft.activeLocation = {locationX: 0, locationY: 0};
    });

export const ListItemBase: FC<ListItemBaseProps> = ({
    activeKey,
    close,
    defaultActiveKey,
    indexKey,
    onActive,
    onClose,
    render,
    supportingText,
    trailing,
    ...renderProps
}) => {
    const [
        {activeLocation, eventName, layout, state, status, trailingEventName, rippleCentered},
        setState,
    ] = useImmer<InitialState>({
        activeLocation: undefined,
        eventName: 'none',
        layout: {} as LayoutRectangle,
        rippleCentered: false,
        state: 'enabled',
        status: 'idle',
        trailingEventName: 'none',
    });

    const theme = useTheme();
    const activeColor = theme.palette.secondary.secondaryContainer;
    const id = useId();
    const underlayColor = theme.palette.surface.onSurface;
    const active = typeof activeKey === 'string' ? activeKey === indexKey : undefined;
    const defaultActive = defaultActiveKey === indexKey;
    const [{height, onCloseAnimated, trailingOpacity}] = useAnimated({
        close,
        eventName,
        layoutHeight: layout?.height,
        state,
        trailingEventName,
    });

    const onStateChange = useCallback(
        (nextState: State, options = {} as OnStateChangeOptions) =>
            processStateChange(nextState, {...options, activeKey, indexKey, setState, onActive}),
        [activeKey, indexKey, onActive, setState],
    );

    const [onEvent] = useOnEvent({...renderProps, onStateChange});
    const onTrailingHoverIn = useCallback(() => processTrailingHoverIn({setState}), [setState]);
    const onTrailingHoverOut = useCallback(() => processTrailingHoverOut({setState}), [setState]);
    const onTrailingPressOut = useCallback(
        () => processTrailingPressOut({close, indexKey, onCloseAnimated, onClose, setState}),
        [close, indexKey, onClose, onCloseAnimated, setState],
    );

    const trailingElement = useMemo(
        () =>
            close ? (
                <IconButton
                    icon={<Icon name={active ? 'remove' : 'close'} type="filled" />}
                    onHoverIn={onTrailingHoverIn}
                    onHoverOut={onTrailingHoverOut}
                    onPressOut={onTrailingPressOut}
                    type="standard"
                />
            ) : (
                trailing
            ),
        [active, close, onTrailingHoverIn, onTrailingHoverOut, onTrailingPressOut, trailing],
    );

    useEffect(() => {
        processActive({active, setState});
    }, [active, setState]);

    useEffect(() => {
        processInit({defaultActive, setState});
    }, [defaultActive, setState]);

    if (status === 'idle') {
        return <></>;
    }

    return render({
        ...renderProps,
        active,
        activeColor,
        activeLocation,
        defaultActive,
        eventName,
        id,
        onEvent,
        rippleCentered,
        renderStyle: {
            containerHeight: height,
            height: layout?.height,
            trailingOpacity,
            width: layout?.width,
        },
        supportingText,
        trailing: trailingElement,
        underlayColor,
    });
};
