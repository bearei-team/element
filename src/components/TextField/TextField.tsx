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
    Label,
    LabelInner,
    LabelText,
    Leading,
    SupportingText,
    Trailing,
} from './TextField.styles';
import {RenderProps, TextFieldBase, TextFieldProps} from './TextFieldBase';

const AnimatedHeaderInner = Animated.createAnimatedComponent(HeaderInner);
const AnimatedLabelInner = Animated.createAnimatedComponent(LabelInner);
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
    onLabelLayout,
}: RenderProps) => {
    const {
        activeIndicatorBackgroundColor,
        activeIndicatorScaleY,
        backgroundColor,
        labelTextColor,
        supportingTextColor,
        labelScale,
        labelTranslateX,
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

                        <Label
                            leadingShow={leadingShow}
                            testID={`textField__label--${id}`}
                            onLayout={onLabelLayout}>
                            <AnimatedLabelInner
                                testID={`textField__labelInner--${id}`}
                                style={{
                                    transform: [{scale: labelScale}, {translateX: labelTranslateX}],
                                }}>
                                <AnimatedLabelText
                                    testID={`textField__labelText--${id}`}
                                    type="body"
                                    size="large"
                                    style={{color: labelTextColor}}>
                                    {labelText}
                                </AnimatedLabelText>
                            </AnimatedLabelInner>
                        </Label>

                        <AnimatedActiveIndicator
                            testID={`textfield__activeIndicator--${id}`}
                            style={{
                                backgroundColor: activeIndicatorBackgroundColor,
                                transform: [{scaleY: activeIndicatorScaleY}],
                            }}
                        />

                        <Hovered
                            eventName={eventName}
                            opacities={[0, 0.08]}
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
