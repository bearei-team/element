import {FC, forwardRef, memo} from 'react'
import {View} from 'react-native'
import Animated from 'react-native-reanimated'
import {Elevation} from '../Elevation/Elevation'
import {TouchableRipple} from '../TouchableRipple/TouchableRipple'
import {Underlay} from '../Underlay/Underlay'
import {Container, Content, Icon, LabelText} from './Button.styles'
import {ButtonBase, ButtonProps, RenderProps} from './ButtonBase'

const AnimatedLabelText = Animated.createAnimatedComponent(LabelText)
const AnimatedTouchableRipple =
    Animated.createAnimatedComponent(TouchableRipple)

const render = ({
    block,
    disabled,
    elevation,
    eventName,
    icon,
    id,
    labelText,
    onEvent,
    renderStyle,
    style,
    type,
    underlayColor,
    ...contentProps
}: RenderProps) => {
    const {contentAnimatedStyle, labelTextAnimatedStyle, ...border} =
        renderStyle

    const link = type === 'link'
    const shape = link ? 'none' : 'full'

    return (
        <Container
            block={block}
            testID={`button--${id}`}
        >
            <AnimatedTouchableRipple
                {...onEvent}
                block={block}
                disabled={disabled}
                shape={shape}
                style={[style, contentAnimatedStyle, border]}
                underlayColor={underlayColor}
            >
                <Content
                    {...contentProps}
                    accessibilityLabel={labelText}
                    accessibilityRole='button'
                    block={block}
                    iconShow={!!icon}
                    testID={`button__content--${id}`}
                    type={type}
                >
                    {icon && !link && (
                        <Icon testID={`button__icon--${id}`}>{icon}</Icon>
                    )}

                    <AnimatedLabelText
                        ellipsizeMode='tail'
                        numberOfLines={1}
                        size={link ? 'small' : 'large'}
                        style={[labelTextAnimatedStyle]}
                        testID={`button__labelText--${id}`}
                        type={link ? 'body' : 'label'}
                    >
                        {labelText}
                    </AnimatedLabelText>

                    <Underlay
                        eventName={eventName}
                        underlayColor={underlayColor}
                    />
                </Content>
            </AnimatedTouchableRipple>

            <Elevation
                level={elevation}
                shape={shape}
            />
        </Container>
    )
}

const ForwardRefButton = forwardRef<View, ButtonProps>((props, ref) => (
    <ButtonBase
        {...props}
        ref={ref}
        render={render}
    />
))

export const Button: FC<ButtonProps> = memo(ForwardRefButton)
export type {ButtonProps}
