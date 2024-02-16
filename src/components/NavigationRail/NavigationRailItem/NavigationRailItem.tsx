import {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, PressableProps, View, ViewProps} from 'react-native';
import {ShapeProps} from '../../Common/Common.styles';
import {Hovered} from '../../Hovered/Hovered';
import {TouchableRipple} from '../../TouchableRipple/TouchableRipple';
import {Container, Header, Icon, LabelText} from './NavigationRailItem.styles';
import {NavigationRailItemBase, RenderProps} from './NavigationRailItemBase';

export interface NavigationRailItemProps
    extends Partial<ViewProps & RefAttributes<View> & Pick<ShapeProps, 'shape'> & PressableProps> {
    activeIcon?: React.JSX.Element;
    activeKey?: string;
    block?: boolean;
    defaultActiveKey?: string;
    icon?: React.JSX.Element;
    indexKey?: string;
    labelText?: string;
    onActive?: (key?: string) => void;
}

const render = ({
    active,
    activeColor,
    activeIcon,
    activeLocation,
    defaultActive,
    eventName,
    icon,
    id,
    labelText,
    onEvent,
    renderStyle,
    rippleCentered,
    underlayColor,
    block,
    ...containerProps
}: RenderProps) => {
    const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
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
                        height={height}
                        shape={shape}
                        eventName={eventName}
                        underlayColor={underlayColor}
                        width={width}
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
