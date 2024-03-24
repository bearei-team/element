import {FC, forwardRef, memo} from 'react'
import {Animated, View} from 'react-native'
import {TouchableRipple} from '../../TouchableRipple/TouchableRipple'
import {Hovered} from '../../Underlay/Hovered'
import {Container, Header, Icon, LabelText} from './NavigationBarItem.styles'
import {
    NavigationBarItemBase,
    NavigationBarItemProps,
    NavigationBarType,
    RenderProps
} from './NavigationBarItemBase'

const AnimatedLabelText = Animated.createAnimatedComponent(LabelText)
const render = ({
    active,
    activeColor,
    eventName,
    icon,
    id,
    labelText,
    onEvent,
    renderStyle,
    touchableLocation,
    type,
    underlayColor,
    ...containerProps
}: RenderProps) => {
    const {color, labelHeight} = renderStyle
    const shape = type === 'block' ? 'full' : 'large'

    return (
        <Container
            {...containerProps}
            accessibilityLabel={labelText}
            accessibilityRole='tab'
            active={active}
            testID={`NavigationBarItem--${id}`}
        >
            <TouchableRipple
                {...onEvent}
                active={active}
                shape={shape}
                touchableLocation={touchableLocation}
                underlayColor={activeColor}
            >
                <Header
                    testID={`NavigationBarItem__header--${id}`}
                    type={type}
                >
                    <Icon testID={`NavigationBarItem__icon--${id}`}>
                        {icon}
                    </Icon>
                    <Hovered
                        eventName={eventName}
                        underlayColor={underlayColor}
                    />
                </Header>
            </TouchableRipple>

            {type === 'segment' && (
                <AnimatedLabelText
                    active={active}
                    size='medium'
                    style={{color, height: labelHeight}}
                    testID={`NavigationBarItem__labelText--${id}`}
                    type='label'
                >
                    {labelText}
                </AnimatedLabelText>
            )}
        </Container>
    )
}

const ForwardRefNavigationBarItem = forwardRef<View, NavigationBarItemProps>(
    (props, ref) => (
        <NavigationBarItemBase
            {...props}
            ref={ref}
            render={render}
        />
    )
)

export const NavigationBarItem: FC<NavigationBarItemProps> = memo(
    ForwardRefNavigationBarItem
)
export type {NavigationBarItemProps, NavigationBarType}
