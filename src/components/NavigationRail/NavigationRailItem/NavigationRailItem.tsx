import {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, PressableProps, View, ViewProps} from 'react-native';
import {ShapeProps} from '../../Common/Common.styles';
import {Hovered} from '../../Hovered/Hovered';
import {TouchableRipple} from '../../TouchableRipple/TouchableRipple';
import {Container, Header, Icon, LabelText} from './NavigationRailItem.styles';
import {NavigationRailItemBase, RenderProps} from './NavigationRailItemBase';

export interface NavigationRailItemProps
    extends Partial<
        ViewProps &
            RefAttributes<View> &
            Pick<ShapeProps, 'shape'> &
            PressableProps
    > {
    activeIcon?: React.JSX.Element;
    activeKey?: string;
    block?: boolean;
    defaultActiveKey?: string;
    icon?: React.JSX.Element;
    indexKey?: string;
    labelText?: string;
    onActive?: (key?: string) => void;
}

const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const ForwardRefNavigationRailItem = forwardRef<View, NavigationRailItemProps>(
    (props, ref) => {
        const render = (renderProps: RenderProps) => {
            const {
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
                style,
                underlayColor,
                ...containerProps
            } = renderProps;

            const {onLayout, ...onTouchableRippleEvent} = onEvent;
            const {width, height, color, labelHeight} = renderStyle;
            const shape = 'large';

            return (
                <Container
                    {...containerProps}
                    accessibilityLabel={labelText}
                    accessibilityRole="tab"
                    style={style}
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
                        <Header testID={`navigationRailItem__header--${id}`}>
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

                    <AnimatedLabelText
                        active={active || defaultActive}
                        size="medium"
                        style={{color, height: labelHeight}}
                        testID={`navigationRailItem__labelText--${id}`}
                        type="label">
                        {labelText}
                    </AnimatedLabelText>
                </Container>
            );
        };

        return <NavigationRailItemBase {...props} ref={ref} render={render} />;
    },
);

export const NavigationRailItem: FC<NavigationRailItemProps> = memo(
    ForwardRefNavigationRailItem,
);
