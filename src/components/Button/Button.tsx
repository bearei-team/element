import {FC, forwardRef, memo} from 'react';
import {
    Animated,
    PressableProps,
    TouchableWithoutFeedback,
    TouchableWithoutFeedbackProps,
} from 'react-native';
import {Elevation} from '../Elevation/Elevation';
import {Hovered} from '../Hovered/Hovered';
import {TouchableRipple} from '../TouchableRipple/TouchableRipple';
import {Container, Content, Icon, LabelText} from './Button.styles';
import {ButtonBase, RenderProps} from './ButtonBase';

export type ButtonType = 'elevated' | 'filled' | 'outlined' | 'text' | 'tonal';
export type Category = 'button' | 'iconButton';

export interface ButtonProps extends Partial<TouchableWithoutFeedbackProps & PressableProps> {
    category?: Category;
    disabled?: boolean;
    icon?: React.JSX.Element;
    labelText?: string;
    loading?: boolean;
    type?: ButtonType;
}

const AnimatedContent = Animated.createAnimatedComponent(Content);
const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const ForwardRefButton = forwardRef<TouchableWithoutFeedback, ButtonProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            category,
            elevation,
            icon,
            iconShow,
            id,
            labelText,
            onBlur,
            onFocus,
            onHoverIn,
            onHoverOut,
            onLongPress,
            onPress,
            onPressIn,
            onPressOut,
            renderStyle,
            shape,
            state,
            style,
            type,
            underlayColor,
            ...containerProps
        } = renderProps;

        const {color, touchableRippleHeight, touchableRippleWidth, ...contentStyle} = renderStyle;
        const isTouchableRippleLaidOut = typeof touchableRippleWidth === 'number';

        return (
            <TouchableWithoutFeedback
                {...containerProps}
                accessibilityLabel={labelText}
                accessibilityRole="button"
                onBlur={onBlur}
                onFocus={onFocus}
                ref={ref}
                testID={`button--${id}`}>
                <Container testID={`button__container--${id}`}>
                    <Elevation level={elevation} shape={shape}>
                        <TouchableRipple
                            shape={shape}
                            underlayColor={underlayColor}
                            onHoverIn={onHoverIn}
                            onHoverOut={onHoverOut}
                            onLongPress={onLongPress}
                            onPress={onPress}
                            onPressIn={onPressIn}
                            onPressOut={onPressOut}>
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

                            {isTouchableRippleLaidOut && (
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
                </Container>
            </TouchableWithoutFeedback>
        );
    };

    return <ButtonBase {...props} render={render} />;
});

export const Button: FC<ButtonProps> = memo(ForwardRefButton);
