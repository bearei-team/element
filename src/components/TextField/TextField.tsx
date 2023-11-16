import React, {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, TextInput, TextInputProps} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {Hovered} from '../Hovered/Hovered';
import {BaseTextField, RenderProps} from './BaseTextField';
import {
    ActiveIndicator,
    Container,
    Content,
    Input,
    Label,
    LeadingIcon,
    Main,
    SupportingText,
    TrailingIcon,
} from './TextField.styles';

export type Type = 'filled' | 'outlined';
export interface TextFieldProps
    extends Partial<TextInputProps & RefAttributes<TextInput> & Pick<ShapeProps, 'shape'>> {
    label?: string;
    type?: Type;
    trailingIcon?: React.JSX.Element;
    leadingIcon?: React.JSX.Element;
    supportingText?: string;
    disabled?: boolean;
    error?: boolean;
}

const ForwardRefTextField = forwardRef<TextInput, TextFieldProps>((props, ref) => {
    const AnimatedActiveIndicator = Animated.createAnimatedComponent(ActiveIndicator);
    const AnimatedLabel = Animated.createAnimatedComponent(Label);
    const AnimatedLeadingIcon = Animated.createAnimatedComponent(LeadingIcon);
    const AnimatedSupportingText = Animated.createAnimatedComponent(SupportingText);
    const AnimatedTextInput = Animated.createAnimatedComponent(Input);
    const AnimatedTrailingIcon = Animated.createAnimatedComponent(TrailingIcon);
    const render = ({
        id,
        inputRef,
        inputState,
        label,
        leadingIcon,
        onBlur,
        onChangeText,
        onFocus,
        onHoverIn,
        onHoverOut,
        onLayout,
        onPress,
        renderStyle,
        shape,
        state,
        supportingText,
        trailingIcon,
        trailingIconShow,
        type,
        underlayColor,
        ...inputProps
    }: RenderProps) => {
        const {
            activeIndicatorColor,
            activeIndicatorHeight,
            height,
            inputHeight,
            labelColor,
            labelLineHeight,
            labelLineLetterSpacing,
            labelSize,
            supportingTextColor,
            width,
        } = renderStyle;

        return (
            <Container
                onHoverIn={onHoverIn}
                onHoverOut={onHoverOut}
                onPress={onPress}
                testID={`textfield--${id}`}>
                <Main
                    onLayout={onLayout}
                    shape={shape}
                    testID={`textField__main--${id}`}
                    trailingIconShow={trailingIconShow}>
                    {leadingIcon && (
                        <AnimatedLeadingIcon testID={`textfield__leadingIcon--${id}`}>
                            {leadingIcon}
                        </AnimatedLeadingIcon>
                    )}

                    <Content>
                        <AnimatedLabel
                            style={{
                                color: labelColor,
                                fontSize: labelSize,
                                letterSpacing: labelLineLetterSpacing,
                                lineHeight: labelLineHeight,
                            }}
                            testID={`textField__label--${id}`}>
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

                    {trailingIconShow && (
                        <AnimatedTrailingIcon testID={`textfield__trailingIcon--${id}`}>
                            {trailingIcon}
                        </AnimatedTrailingIcon>
                    )}

                    {type === 'filled' && (
                        <AnimatedActiveIndicator
                            style={{
                                backgroundColor: activeIndicatorColor,
                                height: activeIndicatorHeight,
                            }}
                            testID={`textfield__activeIndicator--${id}`}
                        />
                    )}

                    <Hovered
                        height={height}
                        shape={shape}
                        state={inputState === 'focused' ? 'enabled' : state}
                        testID={`textField__hovered--${id}`}
                        underlayColor={underlayColor}
                        width={width}
                    />
                </Main>

                {supportingText && (
                    <AnimatedSupportingText
                        style={{color: supportingTextColor}}
                        testID={`textfield__supportingText--${id}`}>
                        {supportingText}
                    </AnimatedSupportingText>
                )}
            </Container>
        );
    };

    return <BaseTextField {...props} ref={ref} render={render} />;
});

export const TextField: FC<TextFieldProps> = memo(ForwardRefTextField);
