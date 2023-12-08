import React, {FC, RefAttributes, forwardRef, memo} from 'react';
import {
    Animated,
    Pressable,
    PressableProps,
    TextInput,
    TextInputProps,
    TouchableWithoutFeedback,
    TouchableWithoutFeedbackProps,
} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {Hovered} from '../Hovered/Hovered';
import {
    ActiveIndicator,
    Container,
    Content,
    Header,
    HeaderInner,
    Label,
    LabelText,
    LabelTextBackground,
    LabelTextBackgroundInner,
    LeadingIcon,
    SupportingText,
    TrailingIcon,
} from './TextField.styles';
import {RenderProps, TextFieldBase} from './TextFieldBase';

export type TextFieldType = 'filled' | 'outlined';
export interface TextFieldProps
    extends Partial<
        TextInputProps &
            TouchableWithoutFeedbackProps &
            PressableProps &
            RefAttributes<TextInput> &
            Pick<ShapeProps, 'shape'>
    > {
    disabled?: boolean;
    error?: boolean;
    labelText?: string;
    leadingIcon?: React.JSX.Element;
    supportingText?: string;
    trailingIcon?: React.JSX.Element;
    type?: TextFieldType;
}

const AnimatedActiveIndicator = Animated.createAnimatedComponent(ActiveIndicator);
const AnimatedHeaderInner = Animated.createAnimatedComponent(HeaderInner);
const AnimatedLabel = Animated.createAnimatedComponent(Label);
const AnimatedLabelTextBackgroundInner = Animated.createAnimatedComponent(LabelTextBackgroundInner);
const AnimatedSupportingText = Animated.createAnimatedComponent(SupportingText);
const ForwardRefTextField = forwardRef<TextInput, TextFieldProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            children,
            error,
            id,
            labelText,
            leadingIcon,
            onHeaderLayout,
            onHoverIn,
            onHoverOut,
            onLabelTextLayout,
            renderStyle,
            shape,
            state,
            supportingText,
            trailingIcon,
            type,
            underlayColor,
            ...containerProps
        } = renderProps;

        const {
            activeIndicatorColor,
            activeIndicatorHeight,
            backgroundColor,
            borderColor,
            borderWidth,
            headerHeight,
            headerWidth,
            labelColor,
            labelLeft,
            labelLineHeight,
            labelLineLetterSpacing,
            labelSize,
            labelTextBackgroundWidth,
            labelTextHeight,
            labelTextWidth,
            labelTop,
            supportingTextColor,
            supportingTextOpacity,
        } = renderStyle;

        const LabelComponent = (
            <AnimatedLabel
                style={{
                    color: labelColor,
                    fontSize: labelSize,
                    left: labelLeft,
                    letterSpacing: labelLineLetterSpacing,
                    lineHeight: labelLineHeight,
                    top: labelTop,
                }}
                testID={`textField__label--${id}`}
                type={type}>
                {labelText}
            </AnimatedLabel>
        );

        return (
            <TouchableWithoutFeedback
                {...(containerProps as TouchableWithoutFeedbackProps)}
                accessibilityLabel={error ? supportingText : labelText}
                accessibilityRole={error ? 'alert' : 'keyboardkey'}
                testID={`textfield--${id}`}>
                <Container testID={`textfield__container--${id}`}>
                    <Header onLayout={onHeaderLayout} testID={`textfield__header--${id}`}>
                        <Pressable
                            onHoverIn={onHoverIn}
                            onHoverOut={onHoverOut}
                            testID={`textfield__pressable--${id}`}>
                            <AnimatedHeaderInner
                                leadingIconShow={!!leadingIcon}
                                shape={shape}
                                style={{backgroundColor, borderColor, borderWidth}}
                                testID={`textField__headerInner--${id}`}
                                trailingIconShow={!!trailingIcon}>
                                {leadingIcon && (
                                    <LeadingIcon testID={`textfield__leadingIcon--${id}`}>
                                        {leadingIcon}
                                    </LeadingIcon>
                                )}

                                <Content testID={`textfield__content--${id}`}>
                                    {type === 'filled' && LabelComponent}
                                    {children}
                                </Content>

                                {trailingIcon && (
                                    <TrailingIcon testID={`textfield__trailingIcon--${id}`}>
                                        {trailingIcon}
                                    </TrailingIcon>
                                )}

                                {type === 'filled' && typeof headerWidth === 'number' && (
                                    <>
                                        <AnimatedActiveIndicator
                                            style={{
                                                backgroundColor: activeIndicatorColor,
                                                height: activeIndicatorHeight,
                                            }}
                                            testID={`textfield__activeIndicator--${id}`}
                                            width={headerWidth}
                                        />

                                        <Hovered
                                            height={headerHeight}
                                            shape={shape}
                                            state={state}
                                            underlayColor={underlayColor}
                                            width={headerWidth}
                                            opacities={[0.08, 0]}
                                        />
                                    </>
                                )}

                                {type === 'outlined' && (
                                    <>
                                        {LabelComponent}
                                        <LabelText
                                            onLayout={onLabelTextLayout}
                                            testID={`textField__labelText--${id}`}>
                                            {labelText}
                                        </LabelText>

                                        <LabelTextBackground
                                            height={labelTextHeight}
                                            width={labelTextWidth}
                                            testID={`textField__labelTextBackground--${id}`}>
                                            <AnimatedLabelTextBackgroundInner
                                                testID={`textField__labelTextBackgroundInner--${id}`}
                                                style={{width: labelTextBackgroundWidth}}
                                            />
                                        </LabelTextBackground>
                                    </>
                                )}
                            </AnimatedHeaderInner>
                        </Pressable>
                    </Header>

                    <AnimatedSupportingText
                        style={{color: supportingTextColor, opacity: supportingTextOpacity}}
                        testID={`textfield__supportingText--${id}`}>
                        {supportingText}
                    </AnimatedSupportingText>
                </Container>
            </TouchableWithoutFeedback>
        );
    };

    return <TextFieldBase {...props} ref={ref} render={render} />;
});

export const TextField: FC<TextFieldProps> = memo(ForwardRefTextField);
