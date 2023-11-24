import React, {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, TextInput, TextInputProps} from 'react-native';
import {Disabled, ShapeProps} from '../Common/Common.styles';
import {Hovered} from '../Hovered/Hovered';
import {
    ActiveIndicator,
    Container,
    Content,
    Core,
    CoreInner,
    Label,
    LabelPlaceholder,
    LabelPlaceholderAfter,
    LabelPlaceholderBefore,
    LabelPlaceholderText,
    LeadingIcon,
    Main,
    SupportingText,
    TrailingIcon,
} from './TextField.styles';
import {RenderProps, TextFieldBase} from './TextFieldBase';

export type TextFieldType = 'filled' | 'outlined';
export interface TextFieldProps
    extends Partial<TextInputProps & RefAttributes<TextInput> & Pick<ShapeProps, 'shape'>> {
    disabled?: boolean;
    error?: boolean;
    label?: string;
    leadingIcon?: React.JSX.Element;
    supportingText?: string;
    trailingIcon?: React.JSX.Element;
    type?: TextFieldType;
}

const AnimatedActiveIndicator = Animated.createAnimatedComponent(ActiveIndicator);
const AnimatedLabel = Animated.createAnimatedComponent(Label);
const AnimatedLabelPlaceholderAfter = Animated.createAnimatedComponent(LabelPlaceholderAfter);
const AnimatedLabelPlaceholderBefore = Animated.createAnimatedComponent(LabelPlaceholderBefore);
const AnimatedMain = Animated.createAnimatedComponent(Main);
const AnimatedSupportingText = Animated.createAnimatedComponent(SupportingText);
const ForwardRefTextField = forwardRef<TextInput, TextFieldProps>((props, ref) => {
    const render = ({
        disabled,
        id,
        inputState,
        label,
        leadingIcon,
        onHoverIn,
        onHoverOut,
        onLabelPlaceholderTextLayout,
        onLayout,
        onPress,
        renderStyle,
        shape,
        state,
        supportingText,
        trailingIcon,
        type,
        underlayColor,
        children,
        style,
    }: RenderProps) => {
        const {
            activeIndicatorColor,
            activeIndicatorHeight,
            backgroundColor,
            borderColor,
            borderWidth,
            height,
            labelColor,
            labelLeft,
            labelLineHeight,
            labelLineLetterSpacing,
            LabelPlaceholderFixWidth,
            labelPlaceholderHeight,
            labelPlaceholderWidth,
            labelSize,
            labelTop,
            supportingTextColor,
            supportingTextOpacity,
            width,
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
                {label}
            </AnimatedLabel>
        );

        return (
            <Container style={style} testID={`textfield--${id}`}>
                <Core testID={`textfield__core--${id}`} onLayout={onLayout}>
                    <CoreInner
                        onHoverIn={onHoverIn}
                        onHoverOut={onHoverOut}
                        onPress={onPress}
                        testID={`textfield__coreInner--${id}`}>
                        <AnimatedMain
                            leadingIconShow={!!leadingIcon}
                            shape={shape}
                            style={{backgroundColor, borderColor, borderWidth}}
                            testID={`textField__main--${id}`}
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

                            {type === 'filled' && (
                                <>
                                    <AnimatedActiveIndicator
                                        style={{
                                            backgroundColor: activeIndicatorColor,
                                            height: activeIndicatorHeight,
                                        }}
                                        testID={`textfield__activeIndicator--${id}`}
                                    />

                                    <Hovered
                                        height={height}
                                        shape={shape}
                                        state={inputState === 'focused' ? 'enabled' : state}
                                        underlayColor={underlayColor}
                                        width={width}
                                    />
                                </>
                            )}

                            {type === 'outlined' && (
                                <>
                                    {LabelComponent}
                                    <LabelPlaceholder
                                        height={labelPlaceholderHeight}
                                        testID={`textField__labelPlaceholder--${id}`}
                                        width={labelPlaceholderWidth}>
                                        <AnimatedLabelPlaceholderBefore
                                            height={labelPlaceholderHeight}
                                            labelPlaceholderWidth={labelPlaceholderWidth}
                                            style={{width: LabelPlaceholderFixWidth}}
                                            testID={`textField__labelPlaceholderBefore--${id}`}
                                        />

                                        <AnimatedLabelPlaceholderAfter
                                            height={labelPlaceholderHeight}
                                            labelPlaceholderWidth={labelPlaceholderWidth}
                                            style={{width: LabelPlaceholderFixWidth}}
                                            testID={`textField__labelPlaceholderAfter--${id}`}
                                        />
                                    </LabelPlaceholder>

                                    <LabelPlaceholderText
                                        onLayout={onLabelPlaceholderTextLayout}
                                        testID={`textField__labelPlaceholderText--${id}`}>
                                        {label}
                                    </LabelPlaceholderText>
                                </>
                            )}
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

    return <TextFieldBase {...props} ref={ref} render={render} />;
});

export const TextField: FC<TextFieldProps> = memo(ForwardRefTextField);
