import {forwardRef, useCallback, useId, useMemo} from 'react';
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
import {AnimatedInterpolation, ComponentStatus, EventName, State} from '../../Common/interface';
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
type ProcessTrailingPressOutOptions = Pick<RenderProps, 'close' | 'dataKey' | 'onClose'> & {
    onCloseAnimated: (finished?: (() => void) | undefined) => void;
} & ProcessEventOptions;

type ProcessStateChangeOptions = OnStateChangeOptions & ProcessPressOutOptions;

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
    {event, eventName, activeKey, dataKey, onActive, setState}: ProcessStateChangeOptions,
) => {
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

const processTrailingPressOut = ({
    close,
    dataKey,
    onCloseAnimated,
    onClose,
}: ProcessTrailingPressOutOptions) => close && onCloseAnimated?.(() => onClose?.(dataKey));

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
            onClose,
            render,
            supportingText,
            trailing,
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
            close,
            eventName,
            layoutHeight: layout?.height,
            state,
            trailingEventName,
        });

        const onStateChange = useCallback(
            (nextState: State, options = {} as OnStateChangeOptions) =>
                processStateChange(nextState, {...options, activeKey, dataKey, setState, onActive}),
            [activeKey, dataKey, onActive, setState],
        );

        const [onEvent] = useOnEvent({...renderProps, onStateChange});
        const onTrailingHoverIn = useCallback(() => processTrailingHoverIn({setState}), [setState]);
        const onTrailingHoverOut = useCallback(
            () => processTrailingHoverOut({setState}),
            [setState],
        );
        const onTrailingPressOut = useCallback(
            () => processTrailingPressOut({close, dataKey, onCloseAnimated, onClose, setState}),
            [close, dataKey, onClose, onCloseAnimated, setState],
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

        return render({
            ...renderProps,
            active,
            activeColor,
            eventName,
            id,
            onEvent,
            ref,
            renderStyle: {
                containerHeight: height,
                height: layout.height,
                trailingOpacity,
                width: layout.width,
            },
            supportingText,
            touchableLocation,
            trailing: trailingElement,
            underlayColor,
        });
    },
);
