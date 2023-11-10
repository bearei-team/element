import {FC, useCallback, useEffect, useId} from 'react';
import {
    Animated,
    GestureResponderEvent,
    MouseEvent,
    NativeSyntheticEvent,
    TargetedEvent,
    TextStyle,
    ViewStyle,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useImmer} from 'use-immer';
import {ShapeProps} from '../Common/Common.styles';
import {ElevationProps} from '../Elevation/Elevation';
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {State} from '../common/interface';
import {ButtonProps} from './Button';
import {useAnimated} from './useAnimated';
import {useShapeProps} from './useShapeProps';
import {useTouchableRippleProps} from './useTouchableRippleProps';

export type RenderProps = ButtonProps & {
    elevationProps: ElevationProps;
    labelStyle: Animated.WithAnimatedObject<TextStyle>;
    mainStyle: Animated.WithAnimatedObject<ViewStyle>;
    shapeProps: ShapeProps;
    showIcon: boolean;
    state: State;
    touchableRippleProps: TouchableRippleProps;
};

export interface BaseButtonProps extends ButtonProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseButton: FC<BaseButtonProps> = ({
    disabled = false,
    icon,
    label,
    onBlur,
    onFocus,
    onHoverIn,
    onHoverOut,
    onPressIn,
    onPressOut,
    render,
    type = 'filled',
    ...renderProps
}) => {
    const [elevationLevel, setElevationLevel] = useImmer<ElevationProps['level']>(0);
    const [state, setState] = useImmer<State>('enabled');
    const id = useId();
    const theme = useTheme();
    const shapeProps = useShapeProps({type, state, disabled});
    const touchableRippleProps = useTouchableRippleProps({type, disabled, ...renderProps});
    const {backgroundColor, color} = useAnimated({type, disabled});
    const mobile = theme.OS === 'ios' || theme.OS === 'android';

    const processElevationLevel = useCallback(
        (nextState: State) => {
            const elevation = {
                disabled: 0,
                enabled: 0,
                error: 0,
                focused: 0,
                hovered: 1,
                pressed: 0,
            };

            setElevationLevel(() =>
                type === 'elevated' ? elevation[nextState] + 1 : elevation[nextState],
            );
        },
        [setElevationLevel, type],
    );

    const processState = useCallback(
        (nextState: State, callback?: () => void) => {
            const isProcessElevation = type === 'elevated' || type === 'filled' || type === 'tonal';

            if (isProcessElevation) {
                processElevationLevel(nextState);
            }

            callback?.();
            setState(() => nextState);
        },
        [processElevationLevel, setState, type],
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

    useEffect(() => {
        if (disabled) {
            setState(() => 'disabled');
        }
    }, [disabled, setState]);

    useEffect(() => {
        if (type === 'elevated' && !disabled) {
            setElevationLevel(() => 1);
        }
    }, [disabled, setElevationLevel, type]);

    return render({
        elevationProps: {level: elevationLevel},
        icon,
        id,
        label,
        labelStyle: {color},
        mainStyle: {backgroundColor},
        shapeProps,
        showIcon: !!icon,
        state,
        touchableRippleProps: {
            ...touchableRippleProps,
            onBlur: handleBlur,
            onFocus: handleFocus,
            onHoverIn: handleHoverIn,
            onHoverOut: handleHoverOut,
            onPressIn: handlePressIn,
            onPressOut: handlePressOut,
        },
        type,
    });
};
