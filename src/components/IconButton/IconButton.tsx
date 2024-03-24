import {FC, forwardRef, memo} from 'react'
import {View} from 'react-native'
import Animated from 'react-native-reanimated'
import {Tooltip} from '../Tooltip/Tooltip'
import {TouchableRipple} from '../TouchableRipple/TouchableRipple'
import {Underlay} from '../Underlay/Underlay'
import {Container, Content} from './IconButton.styles'
import {
    IconButtonBase,
    IconButtonProps,
    IconButtonType,
    RenderProps
} from './IconButtonBase'

/**
 * TODO: Selected
 */
const AnimatedTouchableRipple =
    Animated.createAnimatedComponent(TouchableRipple)

const render = ({
    disabled,
    eventName,
    icon,
    id,
    onEvent,
    renderStyle,
    style,
    supportingPosition,
    supportingText,
    underlayColor,
    tooltipVisible,
    ...contentProps
}: RenderProps) => {
    const {height, width, contentAnimatedStyle, ...border} = renderStyle
    const shape = 'full'

    return (
        <Container
            accessibilityRole='button'
            renderStyle={{width, height}}
            testID={`iconButton--${id}`}
        >
            <Tooltip
                disabled={disabled}
                eventName={eventName}
                supportingPosition={supportingPosition}
                supportingText={supportingText}
                type='plain'
                visible={tooltipVisible}
            >
                <AnimatedTouchableRipple
                    {...onEvent}
                    disabled={disabled}
                    shape={shape}
                    style={[style, contentAnimatedStyle, border]}
                    underlayColor={underlayColor}
                >
                    <Content
                        {...contentProps}
                        renderStyle={{width, height}}
                        testID={`iconButton__content--${id}`}
                    >
                        {icon}
                        <Underlay
                            eventName={eventName}
                            underlayColor={underlayColor}
                        />
                    </Content>
                </AnimatedTouchableRipple>
            </Tooltip>
        </Container>
    )
}

const ForwardRefIconButton = forwardRef<View, IconButtonProps>((props, ref) => (
    <IconButtonBase
        {...props}
        ref={ref}
        render={render}
    />
))

export const IconButton: FC<IconButtonProps> = memo(ForwardRefIconButton)
export type {IconButtonProps, IconButtonType}
