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
import {State} from '../../Common/interface';
import {ItemProps} from './Item';

export interface RenderProps extends ItemProps {
    state: State;
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        touchableRippleHeight: number;
        touchableRippleWidth: number;
    };
    underlayColor: string;
}

export interface ItemBaseProps extends ItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const initialState = {
    state: 'enabled' as State,
    touchableRippleLayout: {} as Pick<LayoutRectangle, 'height' | 'width'>,
};

export const ItemBase: FC<ItemBaseProps> = props => {
    const {
        onBlur,
        onFocus,
        onHoverIn,
        onHoverOut,
        onLayout,
        onPressIn,
        onPressOut,
        render,
        ...renderProps
    } = props;

    const [{state, touchableRippleLayout}, setState] = useImmer(initialState);
    const id = useId();
    const theme = useTheme();
    const underlayColor = theme.palette.surface.onSurface;
    const mobile = ['ios', 'android'].includes(theme.OS);
    const processLayout = (event: LayoutChangeEvent) => {
        const {height, width} = event.nativeEvent.layout;

        setState(draft => {
            draft.touchableRippleLayout = {height, width};
        });

        onLayout?.(event);
    };

    const processState = useCallback(
        (nextState: State, callback?: () => void) => {
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
            touchableRippleHeight: touchableRippleLayout.height,
            touchableRippleWidth: touchableRippleLayout.width,
        },
        state,
        underlayColor,
    });
};
