import {FC, ReactNode, RefAttributes, forwardRef, memo} from 'react';
import {Animated, PressableProps, View} from 'react-native';
import {Disabled, ShapeProps} from '../Common/Common.styles';
import {Elevation} from '../Elevation/Elevation';
import {Hovered} from '../Hovered/Hovered';
import {TouchableRipple} from '../TouchableRipple/TouchableRipple';
import {Container, Icon, Label} from './Button.styles';
import {ButtonBase, RenderProps} from './ButtonBase';

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

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedLabel = Animated.createAnimatedComponent(Label);
const ForwardRefButton = forwardRef<View, ButtonProps>((props, ref) => {
    const render = ({
        disabled,
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
        const {color, height, width, ...mainStyle} = renderStyle;

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
                    <AnimatedContainer
                        shape={shape}
                        showIcon={showIcon}
                        style={{...(typeof style === 'object' && style), ...mainStyle}}
                        testID={`button--${id}`}
                        type={type}>
                        {showIcon && <Icon testID={`button__icon--${id}`}>{icon}</Icon>}

                        <AnimatedLabel style={{color}} testID={`button__label--${id}`} type={type}>
                            {label}
                        </AnimatedLabel>
                    </AnimatedContainer>

                    <Hovered
                        height={height}
                        shape={shape}
                        state={state}
                        underlayColor={underlayColor}
                        width={width}
                    />
                </TouchableRipple>

                {disabled && (
                    <Disabled height={height} testID={`button__disabled--${id}`} width={width} />
                )}
            </Elevation>
        );
    };

    return <ButtonBase {...props} render={render} />;
});

export const Button: FC<ButtonProps> = memo(ForwardRefButton);
