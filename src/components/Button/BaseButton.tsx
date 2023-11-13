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
import {ElevationProps} from '../Elevation/Elevation';
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {State} from '../common/interface';
import {ButtonProps} from './Button';
import {useAnimated} from './useAnimated';
import {useUnderlayColor} from './useUnderlayColor';

export type RenderProps = ButtonProps & {
    elevation: ElevationProps['level'];
    labelStyle: Animated.WithAnimatedObject<TextStyle>;
    mainStyle: Animated.WithAnimatedObject<ViewStyle>;
    showIcon: boolean;
    state: State;
    underlayColor: TouchableRippleProps['underlayColor'];

    // width: number;
    // height: number;
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
    shape = 'full',
    type = 'filled',
    ...renderProps
}) => {
    const [elevation, setElevation] = useImmer<ElevationProps['level']>(0);
    const [state, setState] = useImmer<State>('enabled');
    const id = useId();
    const theme = useTheme();
    const [underlayColor] = useUnderlayColor({type});
    const {backgroundColor, color, borderColor} = useAnimated({type, disabled, state});
    const mobile = theme.OS === 'ios' || theme.OS === 'android';
    const border = borderColor && {
        borderColor: borderColor,
        borderStyle: 'solid' as ViewStyle['borderStyle'],
        borderWidth: 1,
    };

    const processElevation = useCallback(
        (nextState: State) => {
            const level = {
                disabled: 0,
                enabled: 0,
                error: 0,
                focused: 0,
                hovered: 1,
                pressed: 0,
            };

            setElevation(() => (type === 'elevated' ? level[nextState] + 1 : level[nextState]));
        },
        [setElevation, type],
    );

    const processState = useCallback(
        (nextState: State, callback?: () => void) => {
            const isProcessElevation = type === 'elevated' || type === 'filled' || type === 'tonal';

            if (isProcessElevation) {
                processElevation(nextState);
            }

            callback?.();
            setState(() => nextState);
        },
        [processElevation, setState, type],
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
            setElevation(() => 1);
        }
    }, [disabled, setElevation, type]);

    return render({
        ...renderProps,
        elevation,
        icon,
        id,
        label,
        labelStyle: {color},
        mainStyle: {backgroundColor, ...border},
        onBlur: handleBlur,
        onFocus: handleFocus,
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        shape,
        showIcon: !!icon,
        state,
        type,
        underlayColor,
    });
};
