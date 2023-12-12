import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Elevation} from '../Elevation/Elevation';
import {Hovered} from '../Hovered/Hovered';
import {TouchableProps, TouchableRipple} from '../TouchableRipple/TouchableRipple';
import {Container, Content, Icon, LabelText} from './Button.styles';
import {ButtonBase, RenderProps} from './ButtonBase';

export type ButtonType = 'elevated' | 'filled' | 'outlined' | 'text' | 'tonal';
export type Category = 'button' | 'iconButton';

export interface ButtonProps extends TouchableProps {
    category?: Category;
    disabled?: boolean;
    icon?: React.JSX.Element;
    labelText?: string;
    loading?: boolean;
    type?: ButtonType;
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
            underlayColor,
            ...touchableRippleProps
        } = renderProps;

        const {color, touchableRippleHeight, touchableRippleWidth, ...contentStyle} = renderStyle;

        return (
            <Elevation level={elevation} shape={shape}>
                <TouchableRipple
                    {...touchableRippleProps}
                    accessibilityLabel={labelText}
                    accessibilityRole="button"
                    ref={ref}
                    shape={shape}
                    underlayColor={underlayColor}>
                    <Container testID={`button--${id}`}>
                        <AnimatedContent
                            category={category}
                            shape={shape}
                            iconShow={iconShow}
                            style={{...(typeof style === 'object' && style), ...contentStyle}}
                            testID={`button__content--${id}`}
                            type={type}>
                            {iconShow && <Icon testID={`button__icon--${id}`}>{icon}</Icon>}
                            {category === 'button' && (
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
