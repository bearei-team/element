import {FC, ReactNode, RefAttributes, forwardRef, memo} from 'react';
import {Animated, PressableProps, View} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {Elevation} from '../Elevation/Elevation';
import {TouchableRipple} from '../TouchableRipple/TouchableRipple';
import {BaseButton, RenderProps} from './BaseButton';
import {Icon, Label, Main} from './Button.styles';

export type Type = 'elevated' | 'filled' | 'outlined' | 'text' | 'tonal';
export interface ButtonProps
    extends Partial<PressableProps & RefAttributes<View> & Pick<ShapeProps, 'shape'>> {
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
        elevationLevel,
        icon,
        id,
        label,
        labelStyle,
        mainStyle,
        onBlur,
        onFocus,
        onHoverIn,
        onHoverOut,
        onPressIn,
        onPressOut,
        shape,
        showIcon,
        type,
        underlayColor,
        ...containerProps
    }: RenderProps) => {
        const main = (
            <MainContainer
                shape={shape}
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
            <Elevation level={elevationLevel} shape={shape}>
                <TouchableRipple
                    {...containerProps}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onHoverIn={onHoverIn}
                    onHoverOut={onHoverOut}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    ref={ref}
                    shape={shape}
                    underlayColor={underlayColor}>
                    {main}
                </TouchableRipple>
            </Elevation>
        );
    };

    return <BaseButton {...props} render={render} />;
});

export const Button: FC<ButtonProps> = memo(ForwardRefButton);
