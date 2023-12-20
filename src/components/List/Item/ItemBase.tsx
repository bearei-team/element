import {FC, useCallback, useId} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    ViewStyle,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useImmer} from 'use-immer';
import {useHandleEvent} from '../../../hooks/useHandleEvent';
import {Button} from '../../Button/Button';
import {AnimatedInterpolation, State} from '../../Common/interface';
import {Icon} from '../../Icon/Icon';
import {ItemProps} from './Item';
import {useAnimated} from './useAnimated';

export interface RenderProps extends ItemProps {
    state: State;
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        touchableRippleHeight: number;
        touchableRippleWidth: number;
        trailingOpacity: AnimatedInterpolation;
    };
    underlayColor: string;
}

export interface ItemBaseProps extends ItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const initialState = {
    trailingState: 'enabled' as State,
    touchableRippleLayout: {} as LayoutRectangle,
};

export const ItemBase: FC<ItemBaseProps> = props => {
    const {
        active = false,
        close = false,
        onLayout,
        render,
        trailing,
        ...renderProps
    } = props;

    const [{touchableRippleLayout, trailingState}, setState] =
        useImmer(initialState);

    const id = useId();
    const theme = useTheme();
    const underlayColor = theme.palette.surface.onSurface;
    const {state, ...handleEvent} = useHandleEvent({
        ...props,
    });

    const {
        backgroundColor,
        height: animatedHeight,
        onCloseAnimated,
        trailingOpacity,
    } = useAnimated({
        active,
        close,
        state,
        touchableRippleHeight: touchableRippleLayout.height ?? 0,
        trailingState,
    });

    const processLayout = (event: LayoutChangeEvent) => {
        const nativeEventLayout = event.nativeEvent.layout;

        setState(draft => {
            draft.touchableRippleLayout = layout;
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

    const trailingElement = close ? (
        <Button
            category="icon"
            icon={<Icon type="filled" name={active ? 'remove' : 'close'} />}
            onHoverIn={handleTrailingHoverIn}
            onHoverOut={handleTrailingHoverOut}
            onPress={handleTrailingPress}
            type="text"
        />
    ) : (
        trailing
    );

    return render({
        ...renderProps,
        ...handleEvent,
        id,
        onLayout: processLayout,
        renderStyle: {
            backgroundColor,
            height: animatedHeight,
            touchableRippleHeight: touchableRippleLayout.height,
            touchableRippleWidth: touchableRippleLayout.width,
            trailingOpacity,
        },
        state,
        underlayColor,
        trailing: trailingElement,
    });
};
