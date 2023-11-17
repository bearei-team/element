import React, {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, TextInput, TextInputProps} from 'react-native';
import {Disabled, ShapeProps} from '../Common/Common.styles';
import {Hovered} from '../Hovered/Hovered';
import {BaseTextField, RenderProps} from './BaseTextField';
import {
    ActiveIndicator,
    Container,
    Content,
    Core,
    CoreInner,
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
    const AnimatedMain = Animated.createAnimatedComponent(Main);
    const AnimatedSupportingText = Animated.createAnimatedComponent(SupportingText);
    const AnimatedTextInput = Animated.createAnimatedComponent(Input);
    const AnimatedTrailingIcon = Animated.createAnimatedComponent(TrailingIcon);

    const render = ({
        disabled,
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
        type,
        underlayColor,
        style,
        ...inputProps
    }: RenderProps) => {
        const {
            activeIndicatorColor,
            activeIndicatorHeight,
            backgroundColor,
            height,
            inputHeight,
            labelColor,
            labelLineHeight,
            labelLineLetterSpacing,
            labelSize,
            supportingTextColor,
            width,
            supportingTextOpacity,
        } = renderStyle;

        return (
            <Container testID={`textfield--${id}`}>
                <Core style={style} testID={`textfield__core--${id}`}>
                    <CoreInner
                        testID={`textfield__coreInner--${id}`}
                        onHoverIn={onHoverIn}
                        onHoverOut={onHoverOut}
                        onPress={onPress}>
                        <AnimatedMain
                            onLayout={onLayout}
                            style={{backgroundColor}}
                            shape={shape}
                            testID={`textField__main--${id}`}
                            trailingIconShow={!!trailingIcon}
                            leadingIconShow={!!leadingIcon}>
                            {leadingIcon && (
                                <AnimatedLeadingIcon testID={`textfield__leadingIcon--${id}`}>
                                    {leadingIcon}
                                </AnimatedLeadingIcon>
                            )}

                            <Content testID={`textfield__content--${id}`}>
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
                                    onBlur={onBlur}
                                    onChangeText={onChangeText}
                                    onFocus={onFocus}
                                    ref={inputRef}
                                    style={{height: inputHeight}}
                                    testID={`textfield__input--${id}`}
                                />
                            </Content>

                            {trailingIcon && (
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
                                underlayColor={underlayColor}
                                width={width}
                            />
                        </AnimatedMain>
                    </CoreInner>

                    {disabled && (
                        <Disabled
                            height={height}
                            shape={shape}
                            testID={`textField__disabled--${id}`}
                            width={width}
                        />
                    )}
                </Core>

                <AnimatedSupportingText
                    style={{color: supportingTextColor, opacity: supportingTextOpacity}}
                    testID={`textfield__supportingText--${id}`}>
                    {supportingText}
                </AnimatedSupportingText>
            </Container>
        );
    };

    return <BaseTextField {...props} ref={ref} render={render} />;
});

export const TextField: FC<TextFieldProps> = memo(ForwardRefTextField);
