import {FC, useCallback, useId, useMemo} from 'react';
import {
    Animated,
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
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
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        height: number;
        width: number;
        trailingOpacity: AnimatedInterpolation;
    };
    underlayColor: string;
    supportingTextShow: boolean;
    active: boolean;
    activeColor: string;
    eventName: EventName;
    activeEvent?: GestureResponderEvent;
}

export interface ListItemBaseProps extends ListItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const initialState = {
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
    trailingEventName: 'none' as EventName,
};

export const ListItemBase: FC<ListItemBaseProps> = props => {
    const {
        active = false,
        close = false,
        render,
        supportingText,
        trailing,
        ...renderProps
    } = props;

    const [{eventName, trailingEventName, layout}, setState] =
        useImmer(initialState);

    const theme = useTheme();
    const activeColor = theme.palette.secondary.secondaryContainer;
    const id = useId();
    const underlayColor = theme.palette.surface.onSurface;

    const processStateChange = useCallback(
        (_nextState: State, options = {} as OnStateChangeOptions) => {
            const {event, eventName: nextEventName} = options;

            if (nextEventName === 'layout') {
                const nativeEventLayout = (event as LayoutChangeEvent)
                    .nativeEvent.layout;

                setState(draft => {
                    draft.layout = nativeEventLayout;
                });
            }

            setState(draft => {
                draft.eventName = nextEventName;
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
        close && onCloseAnimated();
    }, [close, onCloseAnimated]);

    const trailingElement = useMemo(
        () =>
            close ? (
                <IconButton
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
        eventName,
        id,
        onEvent,
        renderStyle: {
            height: layout?.height,
            trailingOpacity,
            transform: [{scaleY: scale}],
            width: layout?.width,
        },
        supportingText,
        supportingTextShow: !!supportingText,
        trailing: trailingElement,
        underlayColor,
    });
};
