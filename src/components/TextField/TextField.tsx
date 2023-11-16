import React, {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, TextInput, TextInputProps} from 'react-native';
import {BaseTextField, RenderProps} from './BaseTextField';
import {
    ActiveIndicator,
    Container,
    Content,
    Input,
    Label,
    Main,
    SupportingText,
} from './TextField.styles';

export type Type = 'filled' | 'outlined';
export interface TextFieldProps extends Partial<TextInputProps & RefAttributes<TextInput>> {
    label?: string;
    type?: Type;
    trailingIcon?: React.JSX.Element;
    supportingText?: string;
    disabled?: boolean;
    error?: boolean;
}

const ForwardRefTextField = forwardRef<TextInput, TextFieldProps>((props, ref) => {
    const AnimatedTextInput = Animated.createAnimatedComponent(Input);
    const AnimatedLabel = Animated.createAnimatedComponent(Label);
    const AnimatedActiveIndicator = Animated.createAnimatedComponent(ActiveIndicator);
    const AnimatedSupportingText = Animated.createAnimatedComponent(SupportingText);

    const render = ({
        id,
        inputRef,
        label,
        onBlur,
        onChangeText,
        onFocus,
        onHoverIn,
        onHoverOut,
        onPress,
        renderStyle,
        supportingText,
        trailingIconShow,

        type,
        ...inputProps
    }: RenderProps) => {
        const {
            activeIndicatorColor,
            activeIndicatorHeight,
            inputHeight,
            labelColor,
            labelLineHeight,
            labelLineLetterSpacing,
            labelSize,
            supportingTextColor,
        } = renderStyle;

        return (
            <Container
                testID={`textfield--${id}`}
                onPress={onPress}
                onHoverIn={onHoverIn}
                onHoverOut={onHoverOut}>
                <Main
                    testID={`textField__main--${id}`}
                    trailingIconShow={trailingIconShow}
                    shape="extraSmallTop">
                    <Content>
                        <AnimatedLabel
                            testID={`textField__label--${id}`}
                            style={{
                                color: labelColor,
                                lineHeight: labelLineHeight,
                                letterSpacing: labelLineLetterSpacing,
                                fontSize: labelSize,
                            }}>
                            {label}
                        </AnimatedLabel>

                        <AnimatedTextInput
                            {...inputProps}
                            testID={`textfield__input--${id}`}
                            style={{height: inputHeight}}
                            ref={inputRef}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChangeText={onChangeText}
                        />
                    </Content>

                    {type === 'filled' && (
                        <AnimatedActiveIndicator
                            testID={`textfield__activeIndicator--${id}`}
                            style={{
                                height: activeIndicatorHeight,
                                backgroundColor: activeIndicatorColor,
                            }}
                        />
                    )}
                </Main>

                {supportingText && (
                    <AnimatedSupportingText
                        testID={`textfield__supportingText--${id}`}
                        style={{color: supportingTextColor}}>
                        {supportingText}
                    </AnimatedSupportingText>
                )}
            </Container>
        );
    };

    return <BaseTextField {...props} ref={ref} render={render} />;
});

export const TextField: FC<TextFieldProps> = memo(ForwardRefTextField);
