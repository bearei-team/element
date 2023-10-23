import {FC, useEffect, useId} from 'react';
import {GestureResponderEvent, MouseEvent, NativeSyntheticEvent, TargetedEvent} from 'react-native';
import {ButtonProps} from './Button';
import {useImmer} from 'use-immer';
import {useTheme} from 'styled-components/native';
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {ElevationProps} from '../Elevation/Elevation';
import {State} from '../../common/interface';
import {ShapeProps} from '../Shape/Shape';

export type ElevationLevel = ElevationProps['level'];
export type RenderProps = ButtonProps & {
    elevationProps: ElevationProps;
    shapeProps: ShapeProps;
    touchableRippleProps: TouchableRippleProps;
    state: State;
    showIcon?: boolean;
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
}): React.JSX.Element => {
    const id = useId();
    const theme = useTheme();
    const [state, setState] = useImmer<State>('enabled');
    const [elevationLevel, setElevationLevel] = useImmer<ElevationLevel>(0);
    const processState = (nextState: State, callback?: () => void): void => {
        if (state !== 'disabled') {
            callback?.();
            setState(() => nextState);

            if (type === 'filled' || type === 'elevated') {
                processElevationLevel(nextState);
            }
        }
    };

    const processElevationLevel = (nextState: State): void => {
        const elevation = {
            hovered: 1,
            enabled: 0,
            pressed: 0,
            focused: 0,
            disabled: 0,
        };

        console.info(type === 'elevated' ? elevation[nextState] + 1 : elevation[nextState]);

        setElevationLevel(() =>
            type === 'elevated' ? elevation[nextState] + 1 : elevation[nextState],
        );
    };

    const handleHoverIn = (event: MouseEvent): void =>
        processState('hovered', () => onHoverIn?.(event));

    const handleHoverOut = (event: MouseEvent): void =>
        processState('enabled', () => onHoverOut?.(event));

    const handlePressIn = (event: GestureResponderEvent): void =>
        processState('pressed', () => onPressIn?.(event));

    const handlePressOut = (event: GestureResponderEvent): void =>
        processState('hovered', () => onPressOut?.(event));

    const handleFocus = (event: NativeSyntheticEvent<TargetedEvent>): void =>
        processState('focused', () => onFocus?.(event));

    const handleBlur = (event: NativeSyntheticEvent<TargetedEvent>): void =>
        processState('enabled', () => onBlur?.(event));

    const elevationProps: ElevationProps = {level: elevationLevel, shape: 'full'};
    const shapeProps: ShapeProps = {
        shape: 'full',
        ...(type === 'outlined' && {
            border: {
                width: 1,
                style: 'solid',
                color:
                    state === 'disabled'
                        ? theme.color.rgba(theme.palette.surface.onSurface, 0.12)
                        : theme.palette.outline.outline,
            },
        }),
    };

    const touchableRippleProps = {
        ...args,
        underlayColor:
            type === 'outlined' || type === 'text'
                ? theme.palette.primary.primary
                : theme.palette.primary.onPrimary,
        disabled,
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        onFocus: handleFocus,
        onBlur: handleBlur,
    };

    const button = render({
        id,
        type,
        state,
        label,
        icon,
        showIcon: !!icon,
        elevationProps,
        shapeProps,
        touchableRippleProps,
    });

    useEffect(() => {
        if (disabled) {
            setState(() => 'disabled');
        }
    }, [disabled, setState]);

    useEffect(() => {
        if (type === 'elevated') {
            setElevationLevel(() => 1);
        }
    }, [setElevationLevel, type]);

    return button;
};
