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
import {HOOK} from '../../../hooks/hook';
import {OnEvent, OnStateChangeOptions} from '../../../hooks/useOnEvent';
import {AnimatedInterpolation, ComponentStatus, EventName, State} from '../../Common/interface';
import {Icon} from '../../Icon/Icon';
import {IconButton} from '../../IconButton/IconButton';
import {ListItemProps} from './ListItem';
import {useAnimated} from './useAnimated';

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

export interface ListItemBaseProps extends ListItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface ProcessEventOptions {
    setState: Updater<typeof initialState>;
}

export type ProcessPressOutOptions = Pick<RenderProps, 'activeKey' | 'indexKey' | 'onActive'> &
    ProcessEventOptions;

export type ProcessTrailingEventOptions = {callback?: () => void} & ProcessEventOptions;
export type ProcessTrailingPressOutOptions = Pick<RenderProps, 'close' | 'indexKey' | 'onClose'> & {
    onCloseAnimated: (finished?: (() => void) | undefined) => void;
} & ProcessEventOptions;

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
    const responseActive = activeKey !== indexKey;
    const {locationX = 0, locationY = 0} = event.nativeEvent;

    if (responseActive) {
        setState(draft => {
            draft.activeLocation = {locationX, locationY};
        });

        onActive?.(indexKey);
    }
};

const processStateChange = (
    state: State,
    {event, eventName, activeKey, indexKey, onActive, setState} = {} as OnStateChangeOptions &
        ProcessPressOutOptions,
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
}: ProcessTrailingPressOutOptions) => {
    if (close) {
        onCloseAnimated?.(() => onClose?.(indexKey));
    }
};

const processTrailingHoverIn = ({setState}: ProcessEventOptions) =>
    processTrailingEvent('hoverIn', {setState});

const processTrailingHoverOut = ({setState}: ProcessEventOptions) =>
    processTrailingEvent('hoverOut', {setState});

const initialState = {
    activeLocation: undefined as Pick<NativeTouchEvent, 'locationX' | 'locationY'> | undefined,
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
    rippleCentered: false,
    state: 'enabled' as State,
    status: 'idle' as ComponentStatus,
    trailingEventName: 'none' as EventName,
};

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
    ] = useImmer(initialState);
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

    const [onEvent] = HOOK.useOnEvent({
        ...renderProps,
        onStateChange,
    });

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
        if (status === 'idle') {
            setState(draft => {
                draft.rippleCentered = !!defaultActive;
                draft.status = 'succeeded';
            });
        }
    }, [defaultActive, setState, status]);

    useEffect(() => {
        if (status === 'succeeded' && active) {
            setState(draft => {
                if (!draft.activeLocation?.locationX) {
                    draft.rippleCentered = true;
                    draft.activeLocation = {locationX: 0, locationY: 0};
                }
            });
        }
    }, [active, indexKey, onActive, setState, status]);

    useEffect(() => {
        if (activeLocation?.locationX) {
            setState(draft => {
                draft.rippleCentered = false;
            });
        }
    }, [activeLocation, setState]);

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
        rippleCentered,
        id,
        onEvent,
        renderStyle: {
            height: layout?.height,
            containerHeight: height,
            trailingOpacity,
            width: layout?.width,
        },
        supportingText,
        trailing: trailingElement,
        underlayColor,
    });
};
