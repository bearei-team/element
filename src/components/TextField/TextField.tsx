import {FC, forwardRef, memo} from 'react'
import {TextInput} from 'react-native'
import Animated from 'react-native-reanimated'
import {Underlay} from '../Underlay/Underlay'
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
    Trailing
} from './TextField.styles'
import {RenderProps, TextFieldBase, TextFieldProps} from './TextFieldBase'

const AnimatedActiveIndicator =
    Animated.createAnimatedComponent(ActiveIndicator)

const AnimatedHeaderInner = Animated.createAnimatedComponent(HeaderInner)
const AnimatedLabelText = Animated.createAnimatedComponent(LabelText)
const AnimatedSupportingText = Animated.createAnimatedComponent(SupportingText)
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
    underlayColor
}: RenderProps) => {
    const {
        activeIndicatorAnimatedStyle,
        headerInnerAnimatedStyle,
        labelTextAnimatedStyle,
        supportingTextAnimatedStyle
    } = renderStyle

    const shape = 'extraSmallTop'
    const leadingShow = !!leading

    return (
        <Container
            {...(error && {
                accessibilityLabel: supportingText,
                accessibilityRole: 'alert'
            })}
            testID={`textfield--${id}`}
        >
            <Inner testID={`textfield__inner--${id}`}>
                <Header
                    {...onEvent}
                    {...(!error && {
                        accessibilityLabel: labelText,
                        accessibilityRole: 'keyboardkey'
                    })}
                    testID={`textfield__header--${id}`}
                >
                    <AnimatedHeaderInner
                        leadingShow={leadingShow}
                        multiline={multiline}
                        shape={shape}
                        style={[headerInnerAnimatedStyle]}
                        testID={`textfield__headerInner--${id}`}
                        trailingShow={!!trailing}
                    >
                        {leading && (
                            <Leading testID={`textfield__leading--${id}`}>
                                {leading}
                            </Leading>
                        )}

                        <Content
                            multiline={multiline}
                            testID={`textfield__content--${id}`}
                        >
                            <Control
                                multiline={multiline}
                                renderStyle={{height: contentSize?.height}}
                                testID={`textField__control--${id}`}
                            >
                                {input}
                            </Control>
                        </Content>

                        {trailing && (
                            <Trailing testID={`textfield__trailing--${id}`}>
                                {trailing}
                            </Trailing>
                        )}

                        <AnimatedLabelText
                            leadingShow={leadingShow}
                            size='large'
                            style={[labelTextAnimatedStyle]}
                            testID={`textField__labelText--${id}`}
                            type='body'
                        >
                            {labelText}
                        </AnimatedLabelText>

                        <AnimatedActiveIndicator
                            testID={`textfield__activeIndicator--${id}`}
                            style={[activeIndicatorAnimatedStyle]}
                        />

                        <Underlay
                            eventName={eventName}
                            opacities={[0, 0.08]}
                            underlayColor={underlayColor}
                        />
                    </AnimatedHeaderInner>
                </Header>

                <AnimatedSupportingText
                    size='small'
                    style={[supportingTextAnimatedStyle]}
                    type='body'
                >
                    {supportingText}
                </AnimatedSupportingText>
            </Inner>
        </Container>
    )
}

const ForwardRefTextField = forwardRef<TextInput, TextFieldProps>(
    (props, ref) => (
        <TextFieldBase
            {...props}
            ref={ref}
            render={render}
        />
    )
)

export const TextField: FC<TextFieldProps> = memo(ForwardRefTextField)
export type {TextFieldProps}
