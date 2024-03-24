import {FC, forwardRef, memo} from 'react'
import {View} from 'react-native'
import Animated from 'react-native-reanimated'
import {Elevation} from '../Elevation/Elevation'
import {TouchableRipple} from '../TouchableRipple/TouchableRipple'
import {Underlay} from '../Underlay/Underlay'
import {
    Container,
    Content,
    ContentFooter,
    ContentHeader,
    Inner,
    PrimaryButton,
    SecondaryButton,
    SubheadText,
    SupportingText,
    TitleText
} from './Card.styles'
import {CardBase, CardProps, RenderProps} from './CardBase'

const AnimatedSubheadText = Animated.createAnimatedComponent(SubheadText)
const AnimatedSupportingText = Animated.createAnimatedComponent(SupportingText)
const AnimatedTitleText = Animated.createAnimatedComponent(TitleText)
const AnimatedTouchableRipple =
    Animated.createAnimatedComponent(TouchableRipple)

const render = ({
    block,
    disabled,
    elevation,
    eventName,
    footer,
    id,
    onEvent,
    primaryButton,
    renderStyle,
    secondaryButton,
    style,
    subheadText,
    supportingText,
    titleText,
    underlayColor
}: RenderProps) => {
    const {
        contentAnimatedStyle,
        subheadTextAnimatedStyle,
        titleTextAnimatedStyle,
        ...border
    } = renderStyle
    const shape = 'medium'

    return (
        <Container
            block={block}
            testID={`card--${id}`}
        >
            <AnimatedTouchableRipple
                {...onEvent}
                block={block}
                disabled={disabled}
                shape={shape}
                style={[style, contentAnimatedStyle, border]}
                underlayColor={underlayColor}
            >
                <Inner testID={`card__inner--${id}`}>
                    <Content testID={`card__content--${id}`}>
                        <ContentHeader testID={`card__contentHeader--${id}`}>
                            {titleText && (
                                <AnimatedTitleText
                                    size='large'
                                    style={[titleTextAnimatedStyle]}
                                    testID={`card__titleText--${id}`}
                                    type='body'
                                >
                                    {titleText}
                                </AnimatedTitleText>
                            )}

                            {subheadText && (
                                <AnimatedSubheadText
                                    size='medium'
                                    style={[subheadTextAnimatedStyle]}
                                    testID={`card__subheadText--${id}`}
                                    type='body'
                                >
                                    {subheadText}
                                </AnimatedSubheadText>
                            )}
                        </ContentHeader>

                        {supportingText && (
                            <AnimatedSupportingText
                                size='medium'
                                style={[subheadTextAnimatedStyle]}
                                testID={`card__supportingText--${id}`}
                                type='body'
                            >
                                {supportingText}
                            </AnimatedSupportingText>
                        )}

                        {footer && (
                            <ContentFooter
                                testID={`card__contentFooter--${id}`}
                            >
                                <SecondaryButton
                                    testID={`card__secondaryButton--${id}`}
                                >
                                    {secondaryButton}
                                </SecondaryButton>

                                <PrimaryButton
                                    testID={`card__primaryButton--${id}`}
                                >
                                    {primaryButton}
                                </PrimaryButton>
                            </ContentFooter>
                        )}
                    </Content>

                    <Underlay
                        eventName={eventName}
                        underlayColor={underlayColor}
                    />
                </Inner>
            </AnimatedTouchableRipple>

            <Elevation
                level={elevation}
                shape={shape}
            />
        </Container>
    )
}

const ForwardRefCard = forwardRef<View, CardProps>((props, ref) => (
    <CardBase
        {...props}
        ref={ref}
        render={render}
    />
))

export const Card: FC<CardProps> = memo(ForwardRefCard)
export type {CardProps}
