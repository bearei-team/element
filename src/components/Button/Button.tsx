import {FC, ReactNode, RefAttributes, forwardRef, memo} from 'react';
import {Animated, PressableProps, View} from 'react-native';
import {Elevation} from '../Elevation/Elevation';
import {TouchableRipple} from '../TouchableRipple/TouchableRipple';
import {BaseButton, RenderProps} from './BaseButton';
import {Icon, Label, Main} from './Button.styles';

export type Type = 'elevated' | 'filled' | 'outlined' | 'text' | 'tonal';
export interface ButtonProps extends Partial<PressableProps & RefAttributes<View>> {
    children?: ReactNode;
    disabled?: boolean;
    icon?: React.JSX.Element;
    label?: ReactNode;
    loading?: boolean;
    type?: Type;
}

const ForwardRefButton = forwardRef<View, ButtonProps>((props, ref) => {
    const MainContainer = Animated.createAnimatedComponent(Main);
    const LabelContainer = Animated.createAnimatedComponent(Label);

    const render = ({
        elevationProps,
        icon,
        id,
        label,
        labelStyle,
        mainStyle,
        shapeProps,
        showIcon,
        touchableRippleProps,
        type,
        ...containerProps
    }: RenderProps) => {
        const {border, ...restShapeProps} = shapeProps;
        const main = (
            <MainContainer
                {...restShapeProps}
                showIcon={showIcon}
                style={mainStyle}
                testID={`button--${id}`}
                type={type}>
                {showIcon && <Icon testID={`button__icon--${id}`}>{icon}</Icon>}

                <LabelContainer style={labelStyle} testID={`button__label--${id}`} type={type}>
                    {label}
                </LabelContainer>
            </MainContainer>
        );

        return (
            <Elevation {...elevationProps} shapeProps={{border, ...restShapeProps}}>
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
