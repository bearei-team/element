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
import {useImmer} from 'use-immer';
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

const initialState = {
    activeLocation: undefined as Pick<NativeTouchEvent, 'locationX' | 'locationY'> | undefined,
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
    rippleCentered: false,
    state: 'enabled' as State,
    status: 'idle' as ComponentStatus,
    trailingEventName: 'none' as EventName,
};

export const ListItemBase: FC<ListItemBaseProps> = props => {
    const {
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
    } = props;

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

    const processLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const nativeEventLayout = event.nativeEvent.layout;

            setState(draft => {
                draft.layout = nativeEventLayout;
            });
        },
        [setState],
    );

    const processPressOut = useCallback(
        (event: GestureResponderEvent, options: Pick<ListItemProps, 'activeKey' | 'indexKey'>) => {
            const {activeKey: itemActiveKey, indexKey: itemIndexKey} = options;
            const responseActive = itemActiveKey !== itemIndexKey;
            const {locationX = 0, locationY = 0} = event.nativeEvent;

            if (responseActive) {
                setState(draft => {
                    draft.activeLocation = {locationX, locationY};
                });

                onActive?.(itemIndexKey);
            }
        },
        [onActive, setState],
    );

    const processState = useCallback(
        (processPressOutOptions: Pick<ListItemProps, 'activeKey' | 'indexKey'>) =>
            (nextState: State, options = {} as OnStateChangeOptions) => {
                const {event, eventName: nextEventName} = options;
                const nextEvent = {
                    layout: () => {
                        processLayout(event as LayoutChangeEvent);
                    },
                    pressOut: () => {
                        processPressOut(event as GestureResponderEvent, processPressOutOptions);
                    },
                };

                nextEvent[nextEventName as keyof typeof nextEvent]?.();

                setState(draft => {
                    draft.eventName = nextEventName;
                    draft.state = nextState;
                });
            },
        [processLayout, processPressOut, setState],
    );

    const processStateChange = useMemo(
        () => processState({activeKey, indexKey}),
        [activeKey, indexKey, processState],
    );

    const [onEvent] = HOOK.useOnEvent({
        ...props,
        onStateChange: processStateChange,
    });

    const processTrailingEvent = useCallback(
        (nextEventName: EventName, callback?: () => void) => {
            setState(draft => {
                draft.trailingEventName = nextEventName;
            });

            callback?.();
        },
        [setState],
    );

    const handleTrailingHoverIn = useCallback(
        () => processTrailingEvent('hoverIn'),
        [processTrailingEvent],
    );

    const handleTrailingHoverOut = useCallback(
        () => processTrailingEvent('hoverOut'),
        [processTrailingEvent],
    );

    const processTrailingPress = useCallback(
        (options: Pick<ListItemProps, 'close' | 'indexKey'>) => () => {
            const {close: itemClose, indexKey: itemIndexKey} = options;

            if (itemClose) {
                onCloseAnimated(() => {
                    onClose?.(itemIndexKey);
                });
            }
        },
        [onClose, onCloseAnimated],
    );

    const handleTrailingPress = useMemo(
        () => processTrailingPress({close, indexKey}),
        [close, indexKey, processTrailingPress],
    );

    const trailingElement = useMemo(
        () =>
            close ? (
                <IconButton
                    type="standard"
                    icon={<Icon name={active ? 'remove' : 'close'} type="filled" />}
                    onHoverIn={handleTrailingHoverIn}
                    onHoverOut={handleTrailingHoverOut}
                    onPressOut={handleTrailingPress}
                />
            ) : (
                trailing
            ),
        [
            active,
            close,
            handleTrailingHoverIn,
            handleTrailingHoverOut,
            handleTrailingPress,
            trailing,
        ],
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
