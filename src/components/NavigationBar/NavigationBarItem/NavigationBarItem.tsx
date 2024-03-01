import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Hovered} from '../../Hovered/Hovered';
import {TouchableRipple} from '../../TouchableRipple/TouchableRipple';
import {Container, Header, Icon, LabelText} from './NavigationBarItem.styles';
import {
    NavigationBarItemBase,
    NavigationBarItemProps,
    NavigationBarType,
    RenderProps,
} from './NavigationBarItemBase';

const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const render = ({
    active,
    activeColor,
    activeIcon,
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
    const {onLayout, ...onTouchableRippleEvent} = onEvent;
    const {width, height, color, labelHeight} = renderStyle;
    const shape = type === 'block' ? 'full' : 'large';

    return (
        <Container
            {...containerProps}
            accessibilityLabel={labelText}
            accessibilityRole="tab"
            active={active}
            testID={`NavigationBarItem--${id}`}>
            <TouchableRipple
                {...onTouchableRippleEvent}
                active={active}
                onLayout={onLayout}
                shape={shape}
                touchableLocation={touchableLocation}
                underlayColor={activeColor}>
                <Header testID={`NavigationBarItem__header--${id}`} type={type}>
                    <Icon testID={`NavigationBarItem__icon--${id}`}>
                        {active ? activeIcon : icon}
                    </Icon>

                    <Hovered
                        eventName={eventName}
                        renderStyle={{width, height}}
                        shape={shape}
                        underlayColor={underlayColor}
                    />
                </Header>
            </TouchableRipple>

            {type === 'segment' && (
                <AnimatedLabelText
                    active={active}
                    size="medium"
                    style={{color, height: labelHeight}}
                    testID={`NavigationBarItem__labelText--${id}`}
                    type="label">
                    {labelText}
                </AnimatedLabelText>
            )}
        </Container>
    );
};

const ForwardRefNavigationBarItem = forwardRef<View, NavigationBarItemProps>((props, ref) => (
    <NavigationBarItemBase {...props} ref={ref} render={render} />
));

export const NavigationBarItem: FC<NavigationBarItemProps> = memo(ForwardRefNavigationBarItem);
export type {NavigationBarItemProps, NavigationBarType};
