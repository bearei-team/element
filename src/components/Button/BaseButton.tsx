import {FC, useCallback, useEffect, useId} from 'react';
import {GestureResponderEvent, MouseEvent, NativeSyntheticEvent, TargetedEvent} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useImmer} from 'use-immer';
import {ShapeProps} from '../Common/Common.styles';
import {ElevationProps} from '../Elevation/Elevation';
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {State} from '../common/interface';
import {ButtonProps} from './Button';

export type RenderProps = ButtonProps & {
    elevationProps: ElevationProps;
    shapeProps: ShapeProps;
    showIcon: boolean;
    state: State;
    touchableRippleProps: TouchableRippleProps;
};

export interface BaseButtonProps extends ButtonProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseButton: FC<BaseButtonProps> = ({
    type = 'filled',
    label,
    icon,
    render,
    onHoverIn,
    onHoverOut,
    onPressIn,
    onPressOut,
    onFocus,
    onBlur,
    disabled = false,
    ...args
}) => {
    const id = useId();
    const theme = useTheme();
    const [state, setState] = useImmer<State>('enabled');
    const [elevationLevel, setElevationLevel] = useImmer<ElevationProps['level']>(0);
    const mobile = theme.OS === 'ios' || theme.OS === 'android';
    const processElevationLevel = useCallback(
        (nextState: State) => {
            const elevation = {
                hovered: 1,
                enabled: 0,
                pressed: 0,
                focused: 0,
                disabled: 0,
                error: 0,
            };

            setElevationLevel(() =>
                type === 'elevated' ? elevation[nextState] + 1 : elevation[nextState],
            );
        },
        [setElevationLevel, type],
    );

    const processState = useCallback(
        (nextState: State, callback?: () => void) => {
            if (state !== 'disabled') {
                setState(() => nextState);

                const isProcessElevation =
                    type === 'filled' || type === 'elevated' || type === 'tonal';

                if (isProcessElevation) {
                    processElevationLevel(nextState);
                }

                callback?.();
            }
        },
        [processElevationLevel, setState, state, type],
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

    const elevationProps: ElevationProps = {level: elevationLevel};
    const shapeProps: ShapeProps = {
        shape: 'full',
        ...(type === 'outlined' && {
            border: {
                width: 1,
                style: 'solid',
                color:
                    state === 'disabled'
                        ? theme.color.rgba(theme.palette.surface.onSurface, 0.12)
                        : state === 'focused'
                        ? theme.palette.primary.primary
                        : theme.palette.outline.outline,
            },
        }),
    };

    const underlay = {
        filled: theme.palette.primary.onPrimary,
        outlined: theme.palette.primary.primary,
        text: theme.palette.primary.primary,
        elevated: theme.palette.primary.primary,
        tonal: theme.palette.secondary.onSecondaryContainer,
    };

    const touchableRippleProps = {
        ...args,
        underlayColor: underlay[type],
        disabled,
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        onFocus: handleFocus,
        onBlur: handleBlur,
    };

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
        id,
        type,
        state,
        label,
        icon,
        showIcon: !!icon,
        shapeProps,
        elevationProps,
        touchableRippleProps,
    });
};
