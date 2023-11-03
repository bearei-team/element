import {FC, ReactNode, forwardRef, memo} from 'react';
import {BaseButton, RenderProps} from './BaseButton';
import {Icon, Label, Main} from './Button.styles';
import {PressableProps, View} from 'react-native';
import {TouchableRipple} from '../TouchableRipple/TouchableRipple';
import {Elevation} from '../Elevation/Elevation';

export type Type = 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
export interface ButtonProps extends Omit<PressableProps, 'children'> {
    icon?: React.JSX.Element;
    type?: Type;
    label?: ReactNode;
    disabled?: boolean;
    loading?: boolean;
    children?: ReactNode;
}

const ForwardRefButton = forwardRef<View, ButtonProps>((props, ref) => {
    const render = ({
        id,
        label,
        state,
        icon,
        type,
        elevationProps,
        touchableRippleProps,
        showIcon,
        shapeProps,
        ...containerProps
    }: RenderProps) => {
        const {border, ...restShapeProps} = shapeProps;
        const main = (
            <Main
                {...restShapeProps}
                testID={`button--${id}`}
                state={state}
                type={type}
                showIcon={showIcon}>
                {showIcon && <Icon testID={`button__icon--${id}`}>{icon}</Icon>}
                <Label testID={`button__label--${id}`} state={state} type={type}>
                    {label}
                </Label>
            </Main>
        );

        return (
            <Elevation {...elevationProps} shapeProps={{border, ...restShapeProps}} role="button">
                <TouchableRipple
                    {...{...touchableRippleProps, ...containerProps}}
                    ref={ref}
                    shapeProps={restShapeProps}>
                    {main}
                </TouchableRipple>
            </Elevation>
        );
    };

    return <BaseButton {...props} render={render} />;
});

export const Button: FC<ButtonProps> = memo(ForwardRefButton);
