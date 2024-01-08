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
import {
    AnimatedInterpolation,
    ComponentStatus,
    EventName,
    State,
} from '../../Common/interface';
import {Icon} from '../../Icon/Icon';
import {IconButton} from '../../IconButton/IconButton';
import {ListItemProps} from './ListItem';
import {useAnimated} from './useAnimated';

export interface RenderProps extends ListItemProps {
    activeColor: string;
    activeLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    defaultActive?: boolean;
    eventName: EventName;
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        height: number;
        trailingOpacity: AnimatedInterpolation;
        width: number;
    };
    underlayColor: string;
    visible: boolean;
}

export interface ListItemBaseProps extends ListItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const initialState = {
    activeLocation: {} as Pick<NativeTouchEvent, 'locationX' | 'locationY'>,
    defaultActive: undefined as boolean | undefined,
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
    state: 'enabled' as State,
    status: 'idle' as ComponentStatus,
    trailingEventName: 'none' as EventName,
    visible: true,
};

export const ListItemBase: FC<ListItemBaseProps> = props => {
    const {
        active,
        close = false,
        render,
        supportingText,
        trailing,
        onClose,
        indexKey,
        ...renderProps
    } = props;

    const [
        {
            activeLocation,
            defaultActive,
            eventName,
            layout,
            state,
            status,
            trailingEventName,
            visible,
        },
        setState,
    ] = useImmer(initialState);

    const theme = useTheme();
    const activeColor = theme.palette.secondary.secondaryContainer;
    const id = useId();
    const underlayColor = theme.palette.surface.onSurface;
    const processStateChange = useCallback(
        (nextState: State, options = {} as OnStateChangeOptions) => {
            const {event, eventName: nextEventName} = options;
            const {locationX = 0, locationY = 0} =
                nextEventName === 'pressOut'
                    ? (event as GestureResponderEvent).nativeEvent
                    : {};

            if (nextEventName === 'layout') {
                const nativeEventLayout = (event as LayoutChangeEvent)
                    .nativeEvent.layout;

                setState(draft => {
                    draft.layout = nativeEventLayout;
                });
            }

            setState(draft => {
                draft.eventName = nextEventName;
                draft.state = nextState;

                if (nextEventName === 'pressOut') {
                    draft.activeLocation = {locationX, locationY};
                }
            });
        },
        [setState],
    );

    const [onEvent] = HOOK.useOnEvent({
        ...props,
        onStateChange: processStateChange,
    });

    const {scale, onCloseAnimated, trailingOpacity} = useAnimated({
        close,
        eventName,
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

    useEffect(() => {
        if (status === 'idle') {
            setState(draft => {
                if (typeof active === 'boolean') {
                    draft.defaultActive = active;
                }

                draft.status = 'succeeded';
            });
        }
    }, [active, setState, status]);

    if (status === 'idle') {
        return <></>;
    }

    return render({
        ...renderProps,
        active,
        visible,
        defaultActive,
        activeColor,
        eventName,
        id,
        onEvent,
        activeLocation,
        renderStyle: {
            height: layout?.height,
            trailingOpacity,
            transform: [{scaleY: scale}],
            width: layout?.width,
        },
        supportingText,
        trailing: trailingElement,
        underlayColor,
    });
};
