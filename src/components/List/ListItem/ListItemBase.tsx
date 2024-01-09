import {FC, useCallback, useId, useMemo} from 'react';
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
import {AnimatedInterpolation, EventName, State} from '../../Common/interface';
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
    activeLocation: {} as Pick<NativeTouchEvent, 'locationX' | 'locationY'>,
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
    state: 'enabled' as State,
    trailingEventName: 'none' as EventName,
};

export const ListItemBase: FC<ListItemBaseProps> = props => {
    const {
        activeKey,
        close = false,
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
        {activeLocation, eventName, layout, state, trailingEventName},
        setState,
    ] = useImmer(initialState);

    const theme = useTheme();
    const activeColor = theme.palette.secondary.secondaryContainer;
    const id = useId();
    const underlayColor = theme.palette.surface.onSurface;
    const active =
        typeof activeKey === 'string' ? activeKey === indexKey : undefined;

    const processLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const nativeEventLayout = (event as LayoutChangeEvent).nativeEvent
                .layout;

            setState(draft => {
                draft.layout = nativeEventLayout;
            });
        },
        [setState],
    );

    const processPressOut = useCallback(
        (
            event: GestureResponderEvent,
            processPressOutOptions: Pick<OnStateChangeOptions, 'eventName'> & {
                nextState: State;
            },
        ) => {
            const {eventName: nextEventName, nextState} =
                processPressOutOptions;

            const responseActive = activeKey !== indexKey;
            const {locationX = 0, locationY = 0} = event.nativeEvent;

            setState(draft => {
                draft.eventName = nextEventName;
                draft.state = nextState;

                if (responseActive) {
                    draft.activeLocation = {locationX, locationY};
                }
            });

            if (responseActive) {
                onActive?.(indexKey);
            }
        },
        [activeKey, indexKey, onActive, setState],
    );

    const processStateChange = useCallback(
        (nextState: State, options = {} as OnStateChangeOptions) => {
            const {event, eventName: nextEventName} = options;
            const nextEvent = {
                layout: () => {
                    processLayout(event as LayoutChangeEvent);
                },
                pressOut: () => {
                    processPressOut(event as GestureResponderEvent, {
                        eventName: nextEventName,
                        nextState,
                    });
                },
            };

            nextEvent[nextEventName as keyof typeof nextEvent]?.();
        },
        [processLayout, processPressOut],
    );

    const [onEvent] = HOOK.useOnEvent({
        ...props,
        onStateChange: processStateChange,
    });

    const {height, onCloseAnimated, trailingOpacity} = useAnimated({
        close,
        eventName,
        layoutHeight: layout?.height,
        state,
        trailingEventName,
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

    const handleTrailingPress = useCallback(() => {
        close &&
            onCloseAnimated(() => {
                onClose?.(indexKey);
            });
    }, [close, indexKey, onClose, onCloseAnimated]);

    const trailingElement = useMemo(
        () =>
            close ? (
                <IconButton
                    type="standard"
                    icon={
                        <Icon
                            name={active ? 'remove' : 'close'}
                            type="filled"
                        />
                    }
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

    return render({
        ...renderProps,
        active,
        activeColor,
        activeLocation,
        defaultActive: defaultActiveKey === indexKey,
        eventName,
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
