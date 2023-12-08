import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Disabled} from '../Common/Common.styles';
import {Elevation} from '../Elevation/Elevation';
import {Hovered} from '../Hovered/Hovered';
import {TouchableRipple, TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {Container, Content, Icon, LabelText} from './Button.styles';
import {ButtonBase, RenderProps} from './ButtonBase';

export type ButtonType = 'elevated' | 'filled' | 'outlined' | 'text' | 'tonal';
export type Category = 'button' | 'iconButton';

export interface ButtonProps extends TouchableRippleProps {
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
            disabled,
            elevation,
            icon,
            id,
            labelText,
            renderStyle,
            shape,
            iconShow,
            state,
            style,
            type,
            underlayColor,
            category,
            ...touchableRippleProps
        } = renderProps;

        const {color, touchableRippleHeight, touchableRippleWidth, ...contentStyle} = renderStyle;
        const isTouchableRippleLaidOut = typeof touchableRippleWidth === 'number';

        return (
            <Container
                accessibilityLabel={labelText}
                accessibilityRole="button"
                testID={`button--${id}`}>
                <Elevation level={elevation} shape={shape}>
                    <TouchableRipple
                        {...touchableRippleProps}
                        ref={ref}
                        shape={shape}
                        underlayColor={underlayColor}>
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

                {disabled && isTouchableRippleLaidOut && (
                    <Disabled
                        height={touchableRippleHeight}
                        testID={`button__disabled--${id}`}
                        width={touchableRippleWidth}
                    />
                )}
            </Container>
        );
    };

    return <ButtonBase {...props} render={render} />;
});

export const Button: FC<ButtonProps> = memo(ForwardRefButton);
