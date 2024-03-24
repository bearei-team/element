import {FC, forwardRef, memo} from 'react'
import {View} from 'react-native'
import Animated from 'react-native-reanimated'
import {Elevation} from '../Elevation/Elevation'
import {TouchableRipple} from '../TouchableRipple/TouchableRipple'
import {Underlay} from '../Underlay/Underlay'
import {Container, Content, Icon, LabelText} from './FAB.styles'
import {FABBase, FABProps, RenderProps} from './FABBase'

const AnimatedLabelText = Animated.createAnimatedComponent(LabelText)
const AnimatedTouchableRipple =
    Animated.createAnimatedComponent(TouchableRipple)

const render = ({
    accessibilityLabel,
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
    const {contentAnimatedStyle, labelTextAnimatedStyle} = renderStyle
    const shape = 'medium'

    return (
        <Container testID={`fab--${id}`}>
            <AnimatedTouchableRipple
                {...onEvent}
                shape={shape}
                style={[style, contentAnimatedStyle]}
                underlayColor={underlayColor}
            >
                <Content
                    {...contentProps}
                    accessibilityLabel={labelText ?? accessibilityLabel}
                    accessibilityRole='button'
                    labelTextShow={!!labelText}
                    testID={`fab__content--${id}`}
                    type={type}
                >
                    {icon && <Icon testID={`fab__icon--${id}`}>{icon}</Icon>}

                    {labelText && (
                        <AnimatedLabelText
                            size='large'
                            style={[labelTextAnimatedStyle]}
                            testID={`fab__labelText--${id}`}
                            type='label'
                        >
                            {labelText}
                        </AnimatedLabelText>
                    )}

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

const ForwardRefFAB = forwardRef<View, FABProps>((props, ref) => (
    <FABBase
        {...props}
        ref={ref}
        render={render}
    />
))

export const FAB: FC<FABProps> = memo(ForwardRefFAB)
export type {FABProps}
