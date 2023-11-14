import {FC, ReactNode, RefAttributes, forwardRef, memo} from 'react';
import {Animated, PressableProps, View} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {Elevation} from '../Elevation/Elevation';
import {Hovered} from '../Hovered/Hovered';
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

/**
 * TODO:hover Disabled
 */
const ForwardRefButton = forwardRef<View, ButtonProps>((props, ref) => {
    const MainContainer = Animated.createAnimatedComponent(Main);
    const LabelContainer = Animated.createAnimatedComponent(Label);
    const render = ({
        elevation,
        icon,
        id,
        label,
        onBlur,
        onFocus,
        onHoverIn,
        onHoverOut,
        onLayout,
        onPressIn,
        onPressOut,
        renderStyle,
        shape,
        showIcon,
        state,
        style,
        type,
        underlayColor,
        ...touchableRippleProps
    }: RenderProps) => {
        const {color, width, height, ...mainStyle} = renderStyle;
        const main = (
            <MainContainer
                shape={shape}
                showIcon={showIcon}
                style={{...(typeof style === 'object' && style), ...mainStyle}}
                testID={`button--${id}`}
                type={type}>
                {showIcon && <Icon testID={`button__icon--${id}`}>{icon}</Icon>}

                <LabelContainer style={{color}} testID={`button__label--${id}`} type={type}>
                    {label}
                </LabelContainer>
            </MainContainer>
        );

        return (
            <Elevation level={elevation} shape={shape}>
                <TouchableRipple
                    {...touchableRippleProps}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onHoverIn={onHoverIn}
                    onHoverOut={onHoverOut}
                    onLayout={onLayout}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    ref={ref}
                    shape={shape}
                    underlayColor={underlayColor}>
                    {main}

                    <Hovered
                        height={height}
                        shape={shape}
                        state={state}
                        underlayColor={underlayColor}
                        width={width}
                    />
                </TouchableRipple>
            </Elevation>
        );
    };

    return <BaseButton {...props} render={render} />;
});

export const Button: FC<ButtonProps> = memo(ForwardRefButton);
