import {FC, useCallback, useEffect, useId} from 'react';
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
import {State} from '../Common/interface';
import {ElevationProps} from '../Elevation/Elevation';
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {ButtonProps} from './Button';
import {useAnimated} from './useAnimated';
import {useUnderlayColor} from './useUnderlayColor';

export interface RenderProps extends ButtonProps {
    elevation: ElevationProps['level'];
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        touchableRippleHeight: number;
        touchableRippleWidth: number;
    };
    showIcon: boolean;
    state: State;
    underlayColor: TouchableRippleProps['underlayColor'];
}

export interface ButtonBaseProps extends ButtonProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const initialState = {
    elevation: 0 as ElevationProps['level'],
    state: 'enabled' as State,
    touchableRippleLayout: {} as Pick<LayoutRectangle, 'height' | 'width'>,
};

export const ButtonBase: FC<ButtonBaseProps> = props => {
    const {
        disabled = false,
        icon,
        onBlur,
        onFocus,
        onHoverIn,
        onHoverOut,
        onLayout,
        onPressIn,
        onPressOut,
        render,
        type = 'filled',
        ...renderProps
    } = props;

    const [{elevation, touchableRippleLayout, state}, setState] = useImmer(initialState);
    const [underlayColor] = useUnderlayColor({type});
    const {backgroundColor, borderColor, color} = useAnimated({type, disabled, state});
    const id = useId();
    const theme = useTheme();
    const mobile = ['ios', 'android'].includes(theme.OS);
    const border = borderColor && {
        borderColor,
        borderStyle: 'solid' as ViewStyle['borderStyle'],
        borderWidth: theme.adaptSize(1),
    };

    const processElevation = useCallback(
        (nextState: State) => {
            const level = {disabled: 0, enabled: 0, error: 0, focused: 0, hovered: 1, pressed: 0};

            setState(draft => {
                draft.elevation = (
                    type === 'elevated' ? level[nextState] + 1 : level[nextState]
                ) as ElevationProps['level'];
            });
        },
        [setState, type],
    );

    const processState = useCallback(
        (nextState: State, callback?: () => void) => {
            const isProcessElevation = ['elevated', 'filled', 'tonal'].includes(type);

            isProcessElevation && processElevation(nextState);

            setState(draft => {
                draft.state = nextState;
            });

            callback?.();
        },
        [processElevation, setState, type],
    );

    const processLayout = (event: LayoutChangeEvent) => {
        const {height, width} = event.nativeEvent.layout;

        setState(draft => {
            draft.touchableRippleLayout = {height, width};
        });

        onLayout?.(event);
    };

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

    useEffect(() => {
        type === 'elevated' &&
            setState(draft => {
                draft.elevation = disabled ? 0 : 1;
            });
    }, [disabled, setState, type]);

    return render({
        ...renderProps,
        disabled,
        elevation,
        icon,
        id,
        onBlur: handleBlur,
        onFocus: handleFocus,
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
        onLayout: processLayout,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        renderStyle: {
            ...border,
            backgroundColor,
            color,
            touchableRippleHeight: touchableRippleLayout.height,
            touchableRippleWidth: touchableRippleLayout.width,
        },
        shape: 'full',
        showIcon: !!icon,
        state,
        type,
        underlayColor,
    });
};
