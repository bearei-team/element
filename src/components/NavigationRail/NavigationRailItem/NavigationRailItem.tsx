import {FC, forwardRef, memo} from 'react'
import {View} from 'react-native'
import Animated from 'react-native-reanimated'
import {TouchableRipple} from '../../TouchableRipple/TouchableRipple'
import {Underlay} from '../../Underlay/Underlay'
import {Container, Header, Icon, LabelText} from './NavigationRailItem.styles'
import {
    NavigationRailItemBase,
    NavigationRailItemProps,
    NavigationRailType,
    RenderProps
} from './NavigationRailItemBase'

const AnimatedLabelText = Animated.createAnimatedComponent(LabelText)
const render = ({
    active,
    activeColor,
    type,
    eventName,
    icon,
    id,
    labelText,
    onEvent,
    renderStyle,
    touchableLocation,
    underlayColor,
    ...containerProps
}: RenderProps) => {
    const {labelTextAnimatedStyle} = renderStyle
    const shape = type === 'block' ? 'full' : 'large'

    return (
        <Container
            {...containerProps}
            accessibilityLabel={labelText}
            accessibilityRole='tab'
            active={active}
            testID={`navigationRailItem--${id}`}
        >
            <TouchableRipple
                {...onEvent}
                active={active}
                shape={shape}
                touchableLocation={touchableLocation}
                underlayColor={activeColor}
            >
                <Header
                    testID={`navigationRailItem__header--${id}`}
                    type={type}
                >
                    <Icon testID={`navigationRailItem__icon--${id}`}>
                        {icon}
                    </Icon>

                    <Underlay
                        eventName={eventName}
                        underlayColor={underlayColor}
                    />
                </Header>
            </TouchableRipple>

            {type === 'segment' && (
                <AnimatedLabelText
                    active={active}
                    size='medium'
                    style={[labelTextAnimatedStyle]}
                    testID={`navigationRailItem__labelText--${id}`}
                    type='label'
                >
                    {labelText}
                </AnimatedLabelText>
            )}
        </Container>
    )
}

const ForwardRefNavigationRailItem = forwardRef<View, NavigationRailItemProps>(
    (props, ref) => (
        <NavigationRailItemBase
            {...props}
            ref={ref}
            render={render}
        />
    )
)

export const NavigationRailItem: FC<NavigationRailItemProps> = memo(
    ForwardRefNavigationRailItem
)

export type {NavigationRailItemProps, NavigationRailType}
