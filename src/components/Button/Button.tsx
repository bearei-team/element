import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Size} from '../Common/interface';
import {Elevation} from '../Elevation/Elevation';
import {Hovered} from '../Hovered/Hovered';
import {TouchableProps, TouchableRipple} from '../TouchableRipple/TouchableRipple';
import {Container, Content, Icon, LabelText} from './Button.styles';
import {ButtonBase, RenderProps} from './ButtonBase';

export type ButtonType = 'elevated' | 'filled' | 'outlined' | 'text' | 'tonal';
export type Category = 'common' | 'icon' | 'fab';
export type FabType = 'surface' | 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps extends TouchableProps {
    category?: Category;
    disabled?: boolean;
    icon?: React.JSX.Element;
    labelText?: string;
    elevation?: boolean;
    /**
     * The button type only takes effect on the general button; it does not work for categories such as 'fab' and 'icon'
     */
    type?: ButtonType;

    /**
     * The size of the button only takes effect on buttons with the type set to 'fab'.
     */
    size?: Size;

    fabType?: FabType;
}

const AnimatedContent = Animated.createAnimatedComponent(Content);
const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const ForwardRefButton = forwardRef<View, ButtonProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            category,
            elevation,
            icon,
            iconShow,
            id,
            labelText,
            renderStyle,
            shape,
            state,
            style,
            type,
            size,
            underlayColor,
            labelTextShow,
            ...touchableRippleProps
        } = renderProps;

        const {color, touchableRippleHeight, touchableRippleWidth, ...contentStyle} = renderStyle;

        return (
            <Elevation level={elevation} shape={shape}>
                <TouchableRipple
                    {...touchableRippleProps}
                    ref={ref}
                    shape={shape}
                    underlayColor={underlayColor}>
                    <Container
                        accessibilityLabel={labelText}
                        accessibilityRole="button"
                        testID={`button--${id}`}>
                        <AnimatedContent
                            category={category}
                            iconShow={iconShow}
                            labelTextShow={labelTextShow}
                            shape={shape}
                            size={size}
                            style={{...(typeof style === 'object' && style), ...contentStyle}}
                            testID={`button__content--${id}`}
                            type={type}>
                            {iconShow && (
                                <Icon category={category} testID={`button__icon--${id}`}>
                                    {icon}
                                </Icon>
                            )}

                            {category !== 'icon' && labelText && (
                                <AnimatedLabelText
                                    style={{color}}
                                    testID={`button__labelText--${id}`}
                                    type={type}>
                                    {labelText}
                                </AnimatedLabelText>
                            )}
                        </AnimatedContent>
                    </Container>

                    {typeof touchableRippleWidth === 'number' && (
                        <Hovered
                            height={touchableRippleHeight}
                            shape={shape}
                            state={state}
                            underlayColor={underlayColor}
                            width={touchableRippleWidth}
                        />
                    )}
                </TouchableRipple>
            </Elevation>
        );
    };

    return <ButtonBase {...props} render={render} />;
});

export const Button: FC<ButtonProps> = memo(ForwardRefButton);
