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
import {useHandleEvent} from '../../../hooks/useOnEvent';
import {Button} from '../../Button/Button';
import {AnimatedInterpolation, EventName, State} from '../../Common/interface';
import {Icon} from '../../Icon/Icon';
import {ListItemProps} from './ListItem';
import {useAnimated} from './useAnimated';

export interface RenderProps extends ListItemProps {
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        touchableRippleHeight: number;
        touchableRippleWidth: number;
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
    touchableRippleLayout: {} as LayoutRectangle,
    trailingState: 'enabled' as State,
    rippleAnimatedEnd: false,
};

export const ListItemBase: FC<ListItemBaseProps> = props => {
    const {
        active = false,
        close = false,
        onLayout,
        render,
        trailing,
        supportingText,
        ...renderProps
    } = props;

    const [
        {touchableRippleLayout, rippleAnimatedEnd, trailingState},
        setState,
    ] = useImmer(initialState);

    const id = useId();
    const theme = useTheme();
    const underlayColor = theme.palette.surface.onSurface;
    const activeColor = theme.palette.secondary.secondaryContainer;

    const {state, eventName, event, ...handleEvent} = useHandleEvent({
        ...props,
    });

    const {
        height: animatedHeight,
        onCloseAnimated,
        trailingOpacity,
    } = useAnimated({
        active,
        close,
        state,
        touchableRippleHeight: touchableRippleLayout.height ?? 0,
        trailingState,
        rippleAnimatedEnd,
    });

    const processLayout = (event: LayoutChangeEvent) => {
        const nativeEventLayout = event.nativeEvent.layout;

        setState(draft => {
            draft.touchableRippleLayout = nativeEventLayout;
        });

        onLayout?.(event);
    };

    const processTrailingState = useCallback(
        (nextState: State, callback?: () => void) => {
            setState(draft => {
                draft.trailingState = nextState;
            });

            callback?.();
        },
        [setState],
    );

    const handleTrailingHoverIn = useCallback(
        () => processTrailingState('hovered'),
        [processTrailingState],
    );

    const handleTrailingHoverOut = useCallback(
        () => processTrailingState('enabled'),
        [processTrailingState],
    );

    const handleTrailingPress = useCallback(() => {
        close && onCloseAnimated();
    }, [close, onCloseAnimated]);

    const trailingElement = useMemo(
        () =>
            close ? (
                <Button
                    category="icon"
                    icon={
                        <Icon
                            type="filled"
                            name={active ? 'remove' : 'close'}
                        />
                    }
                    onHoverIn={handleTrailingHoverIn}
                    onHoverOut={handleTrailingHoverOut}
                    onPress={handleTrailingPress}
                    type="text"
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
        ...handleEvent,
        ...(eventName === 'pressOut' && {
            activeEvent: event as GestureResponderEvent,
        }),
        activeColor,
        id,
        onLayout: processLayout,
        renderStyle: {
            height: animatedHeight,
            touchableRippleHeight: touchableRippleLayout.height,
            touchableRippleWidth: touchableRippleLayout.width,
            trailingOpacity,
        },
        active,
        eventName,
        supportingText,
        supportingTextShow: !!supportingText,
        trailing: trailingElement,
        underlayColor,
    });
};
