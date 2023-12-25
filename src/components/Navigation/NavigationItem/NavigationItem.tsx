import {FC, RefAttributes, forwardRef, memo} from 'react';
import {
    Animated,
    Pressable,
    PressableProps,
    View,
    ViewProps,
} from 'react-native';
import {ShapeProps} from '../../Common/Common.styles';
import {Hovered} from '../../Hovered/Hovered';
import {
    Container,
    Header,
    Icon,
    IconBackground,
    LabelText,
} from './NavigationItem.styles';
import {NavigationItemBase, RenderProps} from './NavigationItemBase';

export interface NavigationItemProps
    extends Partial<
        ViewProps &
            RefAttributes<View> &
            Pick<ShapeProps, 'shape'> &
            PressableProps
    > {
    active?: boolean;
    activeIcon?: React.JSX.Element;
    icon?: React.JSX.Element;
    labelText?: string;
    block?: boolean;
}

const AnimatedIconBackground = Animated.createAnimatedComponent(IconBackground);
const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const ForwardRefNavigationItem = forwardRef<View, NavigationItemProps>(
    (props, ref) => {
        const render = (renderProps: RenderProps) => {
            const {
                active,
                activeIcon,
                icon,
                id,
                labelText,
                onHeaderLayout,
                onLayout,
                pressPosition,
                renderStyle,
                shape,
                state,
                style,
                underlayColor,
                ...containerProps
            } = renderProps;

            const {
                iconBackgroundColor,
                iconBackgroundWidth,
                headerHeight,
                headerWidth,
                labelColor,
                labelHeight,
            } = renderStyle;

            return (
                <Pressable {...containerProps} ref={ref}>
                    <Container
                        accessibilityLabel={labelText}
                        accessibilityRole="tab"
                        onLayout={onLayout}
                        style={style}
                        testID={`navigationItem--${id}`}>
                        <Header
                            onLayout={onHeaderLayout}
                            pressPosition={pressPosition}
                            testID={`navigationItem__header--${id}`}>
                            <AnimatedIconBackground
                                shape={shape}
                                style={{
                                    backgroundColor: iconBackgroundColor,
                                    width: iconBackgroundWidth,
                                }}
                                testID={`navigationItem__iconInner--${id}`}
                            />

                            <Icon testID={`navigationItem__icon--${id}`}>
                                {active ? activeIcon : icon}
                            </Icon>

                            {typeof headerWidth === 'number' && (
                                <Hovered
                                    height={headerHeight}
                                    shape={shape}
                                    state={state}
                                    underlayColor={underlayColor}
                                    width={headerWidth}
                                />
                            )}
                        </Header>

                        <AnimatedLabelText
                            style={{color: labelColor, height: labelHeight}}
                            testID={`navigationItem__labelText--${id}`}
                            active={active}>
                            {labelText}
                        </AnimatedLabelText>
                    </Container>
                </Pressable>
            );
        };

        return <NavigationItemBase {...props} render={render} />;
    },
);

export const NavigationItem: FC<NavigationItemProps> = memo(
    ForwardRefNavigationItem,
);
