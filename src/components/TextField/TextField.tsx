import {FC, forwardRef, memo} from 'react';
import {Animated, TextInput} from 'react-native';
import {Hovered} from '../Hovered/Hovered';
import {
    ActiveIndicator,
    Container,
    Content,
    Control,
    Header,
    HeaderInner,
    Inner,
    LabelText,
    Leading,
    SupportingText,
    Trailing,
} from './TextField.styles';
import {RenderProps, TextFieldBase, TextFieldProps} from './TextFieldBase';

const AnimatedHeaderInner = Animated.createAnimatedComponent(HeaderInner);
const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const AnimatedSupportingText = Animated.createAnimatedComponent(SupportingText);
const AnimatedActiveIndicator = Animated.createAnimatedComponent(ActiveIndicator);
const render = ({
    contentSize,
    error,
    eventName,
    id,
    input,
    labelText,
    leading,
    multiline,
    onEvent,
    renderStyle,
    supportingText,
    trailing,
    underlayColor,
}: RenderProps) => {
    const {
        activeIndicatorBackgroundColor,
        activeIndicatorHeight,
        backgroundColor,
        height,
        labelTexLineHeight,
        labelTextColor,
        labelTextHeight,
        labelTextLetterSpacing,
        labelTextSize,
        labelTextTop,
        supportingTextColor,
        width,
    } = renderStyle;
    const shape = 'extraSmallTop';
    const leadingShow = !!leading;

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
                        multiline={multiline}
                        shape={shape}
                        testID={`textfield__headerInner--${id}`}
                        leadingShow={leadingShow}
                        trailingShow={!!trailing}
                        style={{backgroundColor}}>
                        {leading && (
                            <Leading testID={`textfield__leading--${id}`}>{leading}</Leading>
                        )}

                        <Content multiline={multiline} testID={`textfield__content--${id}`}>
                            <Control
                                multiline={multiline}
                                renderStyle={{height: contentSize?.height}}
                                testID={`textField__control--${id}`}>
                                {input}
                            </Control>
                        </Content>

                        {trailing && (
                            <Trailing testID={`textfield__trailing--${id}`}>{trailing}</Trailing>
                        )}

                        <AnimatedLabelText
                            testID={`textField__labelText--${id}`}
                            type="body"
                            size="large"
                            leadingShow={leadingShow}
                            style={{
                                color: labelTextColor,
                                fontSize: labelTextSize,
                                height: labelTextHeight,
                                letterSpacing: labelTextLetterSpacing,
                                lineHeight: labelTexLineHeight,
                                top: labelTextTop,
                            }}>
                            {labelText}
                        </AnimatedLabelText>

                        <AnimatedActiveIndicator
                            renderStyle={{width}}
                            testID={`textfield__activeIndicator--${id}`}
                            style={{
                                backgroundColor: activeIndicatorBackgroundColor,
                                height: activeIndicatorHeight,
                            }}
                        />

                        <Hovered
                            eventName={eventName}
                            opacities={[0, 0.08]}
                            renderStyle={{width, height}}
                            shape={shape}
                            underlayColor={underlayColor}
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

const ForwardRefTextField = forwardRef<TextInput, TextFieldProps>((props, ref) => (
    <TextFieldBase {...props} ref={ref} render={render} />
));

export const TextField: FC<TextFieldProps> = memo(ForwardRefTextField);
export type {TextFieldProps};
