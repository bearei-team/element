import {forwardRef, useCallback, useEffect, useId, useMemo} from 'react';
import {
    Animated,
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    NativeTouchEvent,
    View,
    ViewStyle,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../../hooks/useOnEvent';
import {
    AnimatedInterpolation,
    ComponentStatus,
    EventName,
    Size,
    State,
} from '../../Common/interface';
import {Icon} from '../../Icon/Icon';
import {IconButton} from '../../IconButton/IconButton';
import {TouchableRippleProps} from '../../TouchableRipple/TouchableRipple';
import {useAnimated} from './useAnimated';

export interface ListItemProps extends TouchableRippleProps {
    activeKey?: string;
    close?: boolean;
    dataKey?: string;
    gap?: number;
    headline?: string;
    leading?: React.JSX.Element;
    onActive?: (value?: string) => void;
    onClose?: (value?: string) => void;
    supportingText?: string;
    supportingTextNumberOfLines?: number;
    trailing?: React.JSX.Element;
    size?: Size;
}

export interface RenderProps extends ListItemProps {
    active?: boolean;
    activeColor: string;
    eventName: EventName;
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        height: number;
        trailingOpacity: AnimatedInterpolation;
        containerHeight: AnimatedInterpolation;
        width: number;
    };
    touchableLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    underlayColor: string;
}

interface ListItemBaseProps extends ListItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

interface InitialState {
    active?: boolean;
    closed?: boolean;
    eventName: EventName;
    layout: LayoutRectangle;
    state: State;
    status: ComponentStatus;
    touchableLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    trailingEventName: EventName;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessPressOutOptions = Pick<RenderProps, 'activeKey' | 'dataKey' | 'onActive'> &
    ProcessEventOptions;

type ProcessTrailingEventOptions = {callback?: () => void} & ProcessEventOptions;
type ProcessTrailingPressOutOptions = Pick<RenderProps, 'close'> & ProcessEventOptions;

type ProcessCloseOptions = Pick<RenderProps, 'close' | 'dataKey' | 'onClose'> & {
    onCloseAnimated: (finished?: (() => void) | undefined) => void;
};

type ProcessStateChangeOptions = OnStateChangeOptions &
    ProcessPressOutOptions &
    Pick<InitialState, 'trailingEventName'>;

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        const update =
            draft.layout.width !== nativeEventLayout.width ||
            draft.layout.height !== nativeEventLayout.height;

        update && (draft.layout = nativeEventLayout);
    });
};

const processPressOut = (
    event: GestureResponderEvent,
    {activeKey, dataKey, onActive, setState}: ProcessPressOutOptions,
) => {
    if (activeKey === dataKey) {
        return;
    }

    const {locationX = 0, locationY = 0} = event.nativeEvent;

    setState(draft => {
        draft.touchableLocation = {locationX, locationY};
    });

    onActive?.(dataKey);
};

const processStateChange = (
    state: State,
    {
        event,
        eventName,
        activeKey,
        dataKey,
        onActive,
        setState,
        trailingEventName,
    }: ProcessStateChangeOptions,
) => {
    if (trailingEventName === 'hoverIn') {
        return;
    }

    const nextEvent = {
        layout: () => processLayout(event as LayoutChangeEvent, {setState}),
        pressOut: () =>
            processPressOut(event as GestureResponderEvent, {
                activeKey,
                dataKey,
                onActive,
                setState,
            }),
    } as Record<EventName, () => void>;

    nextEvent[eventName]?.();

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

const processTrailingPressOut = ({close, setState}: ProcessTrailingPressOutOptions) =>
    close &&
    setState(draft => {
        draft.closed = true;
    });

const processClose = (
    {close, dataKey, onCloseAnimated, onClose}: ProcessCloseOptions,
    closed?: boolean,
) => close && closed && onCloseAnimated?.(() => onClose?.(dataKey));

const processTrailingHoverIn = ({setState}: ProcessEventOptions) =>
    processTrailingEvent('hoverIn', {setState});

const processTrailingHoverOut = ({setState}: ProcessEventOptions) =>
    processTrailingEvent('hoverOut', {setState});

export const ListItemBase = forwardRef<View, ListItemBaseProps>(
    (
        {
            activeKey,
            close,
            dataKey,
            onActive,
            onClose: onCloseSource,
            render,
            supportingText,
            trailing,
            size = 'medium',
            gap,
            ...renderProps
        },
        ref,
    ) => {
        const [{touchableLocation, eventName, layout, state, trailingEventName, closed}, setState] =
            useImmer<InitialState>({
                eventName: 'none',
                layout: {} as LayoutRectangle,
                state: 'enabled',
                status: 'idle',
                touchableLocation: {} as InitialState['touchableLocation'],
                trailingEventName: 'none',
                closed: false,
            });

        const id = useId();
        const theme = useTheme();
        const activeColor = theme.palette.secondary.secondaryContainer;
        const underlayColor = theme.palette.surface.onSurface;
        const active = activeKey === dataKey;
        const [{height, onCloseAnimated, trailingOpacity}] = useAnimated({
            close,
            eventName,
            layoutHeight: layout?.height,
            state,
            trailingEventName,
            gap,
        });

        const onStateChange = useCallback(
            (nextState: State, options = {} as OnStateChangeOptions) =>
                processStateChange(nextState, {
                    ...options,
                    activeKey,
                    dataKey,
                    setState,
                    onActive,
                    trailingEventName,
                }),
            [activeKey, dataKey, onActive, setState, trailingEventName],
        );

        const [onEvent] = useOnEvent({...renderProps, onStateChange, disabled: closed});
        const onTrailingHoverIn = useCallback(() => processTrailingHoverIn({setState}), [setState]);
        const onTrailingHoverOut = useCallback(
            () => processTrailingHoverOut({setState}),
            [setState],
        );

        const onTrailingPressOut = useCallback(
            () => processTrailingPressOut({close, setState}),
            [close, setState],
        );

        const onClose = useCallback(
            (val?: boolean) =>
                processClose({close, dataKey, onCloseAnimated, onClose: onCloseSource}, val),
            [close, dataKey, onCloseAnimated, onCloseSource],
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
                        renderStyle={
                            size === 'small'
                                ? {
                                      width: theme.adaptSize(theme.spacing.large),
                                      height: theme.adaptSize(theme.spacing.large),
                                  }
                                : {
                                      width: theme.adaptSize(theme.spacing.small * 5),
                                      height: theme.adaptSize(theme.spacing.small * 5),
                                  }
                        }
                    />
                ) : (
                    trailing
                ),
            [
                active,
                close,
                onTrailingHoverIn,
                onTrailingHoverOut,
                onTrailingPressOut,
                size,
                theme,
                trailing,
            ],
        );

        useEffect(() => {
            onClose(closed);
        }, [closed, onClose]);

        return render({
            ...renderProps,
            active,
            activeColor,
            eventName,
            id,
            onEvent,
            ref,
            gap,
            renderStyle: {
                containerHeight: height,
                height: layout.height,
                trailingOpacity,
                width: layout.width,
            },
            size,
            supportingText,
            touchableLocation,
            trailing: trailingElement,
            underlayColor,
        });
    },
);
