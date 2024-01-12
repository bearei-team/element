import {FC, RefAttributes, forwardRef, memo} from 'react';
import {
    Animated,
    PressableProps,
    TextInput,
    TextInputProps,
} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {Hovered} from '../Hovered/Hovered';
import {
    ActiveIndicator,
    Container,
    Content,
    Header,
    HeaderInner,
    Inner,
    LabelText,
    LeadingIcon,
    SupportingText,
    TrailingIcon,
} from './TextField.styles';
import {RenderProps, TextFieldBase} from './TextFieldBase';

export type TextFieldType = 'filled' | 'outlined';
export type InputProps = Partial<
    TextInputProps &
        PressableProps &
        RefAttributes<TextInput> &
        Pick<ShapeProps, 'shape'>
>;

export interface TextFieldProps extends InputProps {
    disabled?: boolean;
    error?: boolean;
    labelText?: string;
    leadingIcon?: React.JSX.Element;
    supportingText?: string;
    trailingIcon?: React.JSX.Element;
    type?: TextFieldType;
}

const AnimatedHeaderInner = Animated.createAnimatedComponent(HeaderInner);
const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const AnimatedSupportingText = Animated.createAnimatedComponent(SupportingText);
const AnimatedActiveIndicator =
    Animated.createAnimatedComponent(ActiveIndicator);

const ForwardRefTextField = forwardRef<TextInput, TextFieldProps>(
    (props, ref) => {
        const render = (renderProps: RenderProps) => {
            const {
                error,
                supportingText,
                id,
                onEvent,
                labelText,
                leadingIcon,
                trailingIcon,
                input,
                renderStyle,
                underlayColor,
                eventName,
            } = renderProps;

            const {
                activeIndicatorBackgroundColor,
                supportingTextColor,
                activeIndicatorScale,
                backgroundColor,
                labelTextColor,
                labelTextHeight,
                labelTextLineHeight,
                labelTextSize,
                labelTextTop,
                labelTextLetterSpacing,
                width,
                height,
            } = renderStyle;

            const shape = 'extraSmallTop';

            return (
                <Container
                    {...(error && {
                        accessibilityLabel: supportingText,
                        accessibilityRole: 'alert',
                    })}
                    testID={`textfield--${id}`}>
                    <Inner testID={`textfield__inner--${id}`}>
                        <Header
                            {...onEvent}
                            {...(!error && {
                                accessibilityLabel: labelText,
                                accessibilityRole: 'keyboardkey',
                            })}
                            testID={`textfield__header--${id}`}>
                            <AnimatedHeaderInner
                                shape={shape}
                                testID={`textfield__headerInner--${id}`}
                                leadingIconShow={!!leadingIcon}
                                trailingIconShow={!!trailingIcon}
                                style={{backgroundColor}}>
                                {leadingIcon && (
                                    <LeadingIcon
                                        testID={`textfield__leadingIcon--${id}`}>
                                        {leadingIcon}
                                    </LeadingIcon>
                                )}

                                <Content testID={`textfield__content--${id}`}>
                                    {input}
                                </Content>

                                {trailingIcon && (
                                    <TrailingIcon
                                        testID={`textfield__trailingIcon--${id}`}>
                                        {trailingIcon}
                                    </TrailingIcon>
                                )}

                                <AnimatedLabelText
                                    testID={`textField__labelText--${id}`}
                                    type="body"
                                    size="large"
                                    style={{
                                        color: labelTextColor,
                                        top: labelTextTop,
                                        fontSize: labelTextSize,
                                        height: labelTextHeight,
                                        lineHeight: labelTextLineHeight,
                                        letterSpacing: labelTextLetterSpacing,
                                    }}>
                                    {labelText}
                                </AnimatedLabelText>

                                <AnimatedActiveIndicator
                                    testID={`textfield__activeIndicator--${id}`}
                                    width={width}
                                    style={{
                                        backgroundColor:
                                            activeIndicatorBackgroundColor,
                                        transform: [
                                            {scaleY: activeIndicatorScale},
                                        ],
                                    }}
                                />

                                <Hovered
                                    height={height}
                                    shape={shape}
                                    eventName={eventName}
                                    underlayColor={underlayColor}
                                    width={width}
                                    opacities={[0, 0.08]}
                                />
                            </AnimatedHeaderInner>
                        </Header>

                        <AnimatedSupportingText
                            type="body"
                            size="small"
                            style={{color: supportingTextColor}}>
                            {supportingText}
                        </AnimatedSupportingText>
                    </Inner>
                </Container>
            );
        };

        return <TextFieldBase {...props} ref={ref} render={render} />;
    },
);

export const TextField: FC<TextFieldProps> = memo(ForwardRefTextField);
