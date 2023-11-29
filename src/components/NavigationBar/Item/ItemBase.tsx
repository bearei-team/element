import {FC, useCallback, useId} from 'react';
import {
    Animated,
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    MouseEvent,
    NativeSyntheticEvent,
    TargetedEvent,
    TextStyle,
    ViewStyle,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useImmer} from 'use-immer';
import {AnimatedInterpolation, State} from '../../Common/interface';
import {ItemProps} from './Item';
import {useAnimated} from './useAnimated';

export interface RenderProps extends ItemProps {
    onIconContainerLayout: (event: LayoutChangeEvent) => void;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        iconContainerHeight: number;
        iconContainerWidth: number;
        labelWeight: AnimatedInterpolation;
        labelColor: AnimatedInterpolation;
    };
    underlayColor: string;
}

export interface ItemBaseProps extends ItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const ItemBase: FC<ItemBaseProps> = ({
    active = false,
    onBlur,
    onFocus,
    onHoverIn,
    onHoverOut,
    onPressIn,
    onPressOut,
    render,
    ...renderProps
}) => {
    const [iconContainerLayout, setIconContainerLayout] = useImmer(
        {} as Pick<LayoutRectangle, 'height' | 'width'>,
    );

    const [state, setState] = useImmer<State>('enabled');
    const id = useId();
    const theme = useTheme();
    const {backgroundColor, labelWeight, labelColor} = useAnimated({active});
    const underlayColor = active
        ? theme.palette.surface.onSurface
        : theme.palette.secondary.onSecondaryContainer;

    const mobile = ['ios', 'android'].includes(theme.OS);
    const processState = useCallback(
        (nextState: State, callback?: () => void) => {
            setState(() => nextState);
            callback?.();
        },
        [setState],
    );

    const processIconContainerLayout = (event: LayoutChangeEvent) => {
        const {height, width} = event.nativeEvent.layout;

        setIconContainerLayout(() => ({height, width}));
    };

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

    const handlePressIn = useCallback(
        (event: GestureResponderEvent) => processState('pressed', () => onPressIn?.(event)),
        [onPressIn, processState],
    );

    const handlePressOut = useCallback(
        (event: GestureResponderEvent) =>
            processState(mobile ? 'enabled' : 'hovered', () => onPressOut?.(event)),
        [mobile, onPressOut, processState],
    );

    return render({
        ...renderProps,
        id,
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
        onIconContainerLayout: processIconContainerLayout,
        onBlur: handleBlur,
        onFocus: handleFocus,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        renderStyle: {
            iconContainerHeight: iconContainerLayout.height,
            iconContainerWidth: iconContainerLayout.width,
            backgroundColor,
            labelWeight,
            labelColor,
        },
        state,
        underlayColor,
    });
};
