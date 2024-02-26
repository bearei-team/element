import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Hovered} from '../../Hovered/Hovered';
import {TouchableRipple} from '../../TouchableRipple/TouchableRipple';
import {Container, Header, Icon, LabelText} from './NavigationRailItem.styles';
import {
    NavigationRailItemBase,
    NavigationRailItemProps,
    RenderProps,
} from './NavigationRailItemBase';

const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const render = ({
    active,
    activeColor,
    activeIcon,
    activeLocation,
    block,
    defaultActive,
    eventName,
    icon,
    id,
    labelText,
    onEvent,
    renderStyle,
    rippleCentered,
    underlayColor,
    ...containerProps
}: RenderProps) => {
    const {onLayout, ...onTouchableRippleEvent} = onEvent;
    const {width, height, color, labelHeight} = renderStyle;
    const shape = block ? 'full' : 'large';

    return (
        <Container
            {...containerProps}
            accessibilityLabel={labelText}
            accessibilityRole="tab"
            active={active ?? defaultActive}
            testID={`navigationRailItem--${id}`}>
            <TouchableRipple
                {...onTouchableRippleEvent}
                active={active}
                activeLocation={activeLocation}
                centered={rippleCentered}
                defaultActive={defaultActive}
                onLayout={onLayout}
                shape={shape}
                underlayColor={activeColor}>
                <Header testID={`navigationRailItem__header--${id}`} block={block}>
                    <Icon testID={`navigationRailItem__icon--${id}`}>
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

            {!block && (
                <AnimatedLabelText
                    active={active ?? defaultActive}
                    size="medium"
                    style={{color, height: labelHeight}}
                    testID={`navigationRailItem__labelText--${id}`}
                    type="label">
                    {labelText}
                </AnimatedLabelText>
            )}
        </Container>
    );
};

const ForwardRefNavigationRailItem = forwardRef<View, NavigationRailItemProps>((props, ref) => (
    <NavigationRailItemBase {...props} ref={ref} render={render} />
));

export const NavigationRailItem: FC<NavigationRailItemProps> = memo(ForwardRefNavigationRailItem);
export type {NavigationRailItemProps};
