import {FC, forwardRef, memo} from 'react'
import {View} from 'react-native'
import Animated from 'react-native-reanimated'
import {Elevation} from '../Elevation/Elevation'
import {TouchableRipple} from '../TouchableRipple/TouchableRipple'
import {Underlay} from '../Underlay/Underlay'
import {Container, Content, Icon, LabelText} from './Chip.styles'
import {ChipBase, ChipProps, RenderProps} from './ChipBase'

const AnimatedTouchableRipple =
    Animated.createAnimatedComponent(TouchableRipple)

const AnimatedLabelText = Animated.createAnimatedComponent(LabelText)
const render = ({
    active,
    activeColor,
    touchableLocation,
    disabled,
    elevation,
    eventName,
    icon,
    id,
    labelText,
    onEvent,
    renderStyle,
    style,
    trailingIcon,
    type,
    underlayColor,
    block,
    ...contentProps
}: RenderProps) => {
    const {contentAnimatedStyle, labelTextAnimatedStyle, ...border} =
        renderStyle
    const shape = 'extraSmall'

    return (
        <Container
            accessibilityLabel={labelText}
            block={block}
            testID={`chip--${id}`}
        >
            <AnimatedTouchableRipple
                {...onEvent}
                active={active}
                block={block}
                disabled={disabled}
                shape={shape}
                style={[style, contentAnimatedStyle, border]}
                touchableLocation={touchableLocation}
                underlayColor={activeColor}
            >
                <Content
                    {...contentProps}
                    iconShow={!!icon}
                    testID={`chip__content--${id}`}
                    trailingIconShow={!!trailingIcon}
                    type={type}
                >
                    {icon && <Icon testID={`chip__icon--${id}`}>{icon}</Icon>}

                    <AnimatedLabelText
                        ellipsizeMode='tail'
                        numberOfLines={1}
                        size='large'
                        style={[labelTextAnimatedStyle]}
                        testID={`chip__labelText--${id}`}
                        type='label'
                    >
                        {labelText}
                    </AnimatedLabelText>

                    {trailingIcon && (
                        <Icon testID={`chip__trailingIcon--${id}`}>
                            {trailingIcon}
                        </Icon>
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

const ForwardRefChip = forwardRef<View, ChipProps>((props, ref) => (
    <ChipBase
        {...props}
        ref={ref}
        render={render}
    />
))

export const Chip: FC<ChipProps> = memo(ForwardRefChip)
export type {ChipProps}
