import {FC, useCallback, useId} from 'react';
import {
    Animated,
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    MouseEvent,
    NativeSyntheticEvent,
    TargetedEvent,
    ViewStyle,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useImmer} from 'use-immer';
import {Button} from '../../Button/Button';
import {AnimatedInterpolation} from '../../Common/interface';
import {Icon} from '../../Icon/Icon';
import {ItemProps, ListItemState} from './Item';
import {useAnimated} from './useAnimated';

export interface RenderProps extends ItemProps {
    state: ListItemState;
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
    state: 'enabled' as ListItemState,
    touchableRippleLayout: {} as Pick<LayoutRectangle, 'height' | 'width'>,
};

export const ItemBase: FC<ItemBaseProps> = props => {
    const {
        active = false,
        close = false,
        onBlur,
        onFocus,
        onHoverIn,
        onHoverOut,
        onLayout,
        onPressIn,
        onPressOut,
        render,
        trailing,
        ...renderProps
    } = props;

    const [{state, touchableRippleLayout}, setState] = useImmer(initialState);
    const id = useId();
    const theme = useTheme();
    const {
        backgroundColor,
        height: animatedHeight,
        onCloseAnimated,
        trailingOpacity,
    } = useAnimated({active, close, state});

    const mobile = ['ios', 'android'].includes(theme.OS);
    const underlayColor = theme.palette.surface.onSurface;

    const processLayout = (event: LayoutChangeEvent) => {
        const {height, width} = event.nativeEvent.layout;

        setState(draft => {
            draft.touchableRippleLayout = {height, width};
        });

        onLayout?.(event);
    };

    const processState = useCallback(
        (nextState: ListItemState, callback?: () => void) => {
            setState(draft => {
                draft.state = nextState;
            });

            callback?.();
        },
        [setState],
    );

    const handlePressIn = useCallback(
        (event: GestureResponderEvent) => processState('pressed', () => onPressIn?.(event)),
        [onPressIn, processState],
    );

    const handlePressOut = useCallback(
        (event: GestureResponderEvent) =>
            processState(mobile ? 'enabled' : 'hovered', () => onPressOut?.(event)),
        [mobile, onPressOut, processState],
    );

    const handleHoverIn = useCallback(
        (event: MouseEvent) => processState('hovered', () => onHoverIn?.(event)),
        [onHoverIn, processState],
    );

    const handleHoverOut = useCallback(
        (event: MouseEvent) => processState('enabled', () => onHoverOut?.(event)),
        [onHoverOut, processState],
    );

    const handleFocus = useCallback(
        (event: NativeSyntheticEvent<TargetedEvent>) =>
            processState('focused', () => onFocus?.(event)),
        [onFocus, processState],
    );

    const handleBlur = useCallback(
        (event: NativeSyntheticEvent<TargetedEvent>) =>
            processState('enabled', () => onBlur?.(event)),
        [onBlur, processState],
    );

    const handleTrailingHoverIn = useCallback(
        () => processState('trailingHovered'),
        [processState],
    );

    const handleTrailingHoverOut = useCallback(() => processState('hovered'), [processState]);
    const handleTrailingPress = useCallback(() => {
        close && onCloseAnimated();
    }, [close, onCloseAnimated]);

    const trailingElement = close ? (
        <Button
            category="iconButton"
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
        id,
        onBlur: handleBlur,
        onFocus: handleFocus,
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
        onLayout: processLayout,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
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
