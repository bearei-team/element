import React, {cloneElement, forwardRef, useCallback, useEffect, useId, useMemo} from 'react';
import {
    Animated,
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    NativeTouchEvent,
    View,
    ViewStyle,
} from 'react-native';
import {DefaultTheme, useTheme} from 'styled-components/native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../../hooks/useOnEvent';
import {
    AnimatedInterpolation,
    ComponentStatus,
    EventName,
    Size,
    State,
} from '../../Common/interface';
import {Icon, IconName, IconType} from '../../Icon/Icon';
import {IconButton} from '../../IconButton/IconButton';
import {TouchableRippleProps} from '../../TouchableRipple/TouchableRipple';
import {useAnimated} from './useAnimated';

export interface ListItemProps extends TouchableRippleProps {
    activeKey?: string;
    close?: boolean;
    closeIcon?: boolean;
    closeIconName?: IconName;
    closeIconType?: IconType;
    dataKey?: string;
    gap?: number;
    headline?: string;
    leading?: React.JSX.Element;
    onActive?: (value?: string) => void;
    onClose?: (value?: string) => void;
    size?: Size;
    supporting?: string | React.JSX.Element;
    supportingTextNumberOfLines?: number;
    trailing?: React.JSX.Element;
    trailingControl?: boolean;
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
type ProcessCloseOptions = Pick<RenderProps, 'dataKey' | 'onClose'> & {
    onCloseAnimated: (finished?: (() => void) | undefined) => void;
};

type ProcessStateChangeOptions = OnStateChangeOptions &
    ProcessPressOutOptions &
    Pick<InitialState, 'trailingEventName'>;

interface RenderTrailingOptions
    extends Pick<
        RenderProps,
        'closeIcon' | 'onEvent' | 'trailing' | 'size' | 'closeIconName' | 'closeIconType'
    > {
    theme: DefaultTheme;
}

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
        draft.eventName = eventName === 'hoverIn' ? 'none' : 'hoverIn';
    });

    callback?.();
};

const processClose = ({dataKey, onCloseAnimated, onClose}: ProcessCloseOptions, value?: boolean) =>
    typeof value === 'boolean' && value && onCloseAnimated?.(() => onClose?.(dataKey));

const processTrailingHoverIn = ({setState}: ProcessEventOptions) =>
    processTrailingEvent('hoverIn', {setState});

const processTrailingHoverOut = ({setState}: ProcessEventOptions) =>
    processTrailingEvent('hoverOut', {setState});

const renderTrailing = ({
    closeIcon,
    onEvent,
    size,
    theme,
    trailing,
    closeIconName,
    closeIconType,
}: RenderTrailingOptions) => {
    const {onHoverIn, onHoverOut, onPressOut} = onEvent;
    const trailingElement = trailing ? cloneElement(trailing, {onHoverIn, onHoverOut}) : trailing;

    return closeIcon ? (
        <IconButton
            icon={<Icon name={closeIconName} type={closeIconType} />}
            onPressOut={onPressOut}
            onHoverIn={onHoverIn}
            onHoverOut={onHoverOut}
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
        trailingElement
    );
};

export const ListItemBase = forwardRef<View, ListItemBaseProps>(
    (
        {
            activeKey,
            closeIcon,
            closeIconName = 'close',
            closeIconType = 'filled',
            dataKey,
            gap,
            onActive,
            onClose: onCloseSource,
            render,
            size = 'medium',
            supporting,
            trailing,
            trailingControl,
            close,
            ...renderProps
        },
        ref,
    ) => {
        const [{touchableLocation, eventName, layout, state, trailingEventName}, setState] =
            useImmer<InitialState>({
                eventName: 'none',
                layout: {} as LayoutRectangle,
                state: 'enabled',
                status: 'idle',
                touchableLocation: {} as InitialState['touchableLocation'],
                trailingEventName: 'none',
            });

        const id = useId();
        const theme = useTheme();
        const activeColor = theme.palette.secondary.secondaryContainer;
        const underlayColor = theme.palette.surface.onSurface;
        const active = activeKey === dataKey;
        const [{height, onCloseAnimated, trailingOpacity}] = useAnimated({
            eventName,
            gap,
            layoutHeight: layout?.height,
            state,
            trailingEventName,
            trailingControl,
        });

        const onStateChange = useCallback(
            (nextState: State, options = {} as OnStateChangeOptions) =>
                processStateChange(nextState, {
                    ...options,
                    activeKey,
                    dataKey,
                    onActive,
                    setState,
                    trailingEventName,
                }),
            [activeKey, dataKey, onActive, setState, trailingEventName],
        );

        const [onEvent] = useOnEvent({...renderProps, onStateChange});
        const onTrailingHoverIn = useCallback(() => processTrailingHoverIn({setState}), [setState]);
        const onTrailingHoverOut = useCallback(
            () => processTrailingHoverOut({setState}),
            [setState],
        );

        const onClose = useCallback(
            (value?: boolean) =>
                processClose({dataKey, onCloseAnimated, onClose: onCloseSource}, value),
            [dataKey, onCloseAnimated, onCloseSource],
        );

        const trailingElement = useMemo(
            () =>
                renderTrailing({
                    closeIcon,
                    onEvent: {
                        onHoverIn: onTrailingHoverIn,
                        onHoverOut: onTrailingHoverOut,
                        onPressOut: onClose,
                    } as unknown as OnEvent,
                    closeIconName,
                    closeIconType,
                    theme,
                    trailing,
                }),
            [
                closeIcon,
                closeIconName,
                closeIconType,
                onClose,
                onTrailingHoverIn,
                onTrailingHoverOut,
                theme,
                trailing,
            ],
        );

        useEffect(() => {
            onClose(close);
        }, [close, onClose]);

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
            supporting,
            touchableLocation,
            trailing: trailingElement,
            underlayColor,
        });
    },
);
