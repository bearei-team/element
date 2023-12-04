import {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, PressableProps, View, ViewProps} from 'react-native';
import {ShapeProps} from '../../Common/Common.styles';
import {State} from '../../Common/interface';
import {Hovered} from '../../Hovered/Hovered';
import {Container, Icon, IconBackground, IconContainer, LabelText} from './Item.styles';
import {ItemBase, RenderProps} from './ItemBase';

export type PropsBase = Partial<
    ViewProps &
        RefAttributes<View> &
        Pick<ShapeProps, 'shape'> &
        Pick<
            PressableProps,
            | 'onBlur'
            | 'onFocus'
            | 'onHoverIn'
            | 'onHoverOut'
            | 'onPressIn'
            | 'onPressOut'
            | 'onPress'
        >
>;
export interface ItemProps extends PropsBase {
    active?: boolean;
    activeIcon?: React.JSX.Element;
    icon?: React.JSX.Element;
    labelText?: string;
    state?: State;
}

const AnimatedIconBackground = Animated.createAnimatedComponent(IconBackground);
const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const ForwardRefItem = forwardRef<View, ItemProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            active,
            activeIcon,
            icon,
            id,
            labelText,
            onBlur,
            onFocus,
            onHoverIn,
            onHoverOut,
            onIconContainerLayout,
            onPress,
            onPressIn,
            onPressOut,
            renderStyle,
            shape,
            state,
            underlayColor,
            pressPosition,
            ...containerProps
        } = renderProps;

        const {
            iconBackgroundColor,
            iconBackgroundWidth,
            iconContainerHeight,
            iconContainerWidth,
            labelColor,
            labelHeight,
        } = renderStyle;

        return (
            <Container
                {...containerProps}
                accessibilityLabel={labelText}
                accessibilityRole="tab"
                ref={ref}
                testID={`navigationBarItem--${id}`}>
                <IconContainer
                    pressPosition={pressPosition}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onHoverIn={onHoverIn}
                    onHoverOut={onHoverOut}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    onLayout={onIconContainerLayout}
                    onPress={onPress}
                    testID={`navigationBarItem__iconContainer--${id}`}>
                    <AnimatedIconBackground
                        shape={shape}
                        style={{backgroundColor: iconBackgroundColor, width: iconBackgroundWidth}}
                        testID={`navigationBarItem__iconInner--${id}`}
                    />

                    <Icon testID={`navigationBarItem__icon--${id}`}>
                        {active ? activeIcon : icon}
                    </Icon>

                    {typeof iconContainerWidth === 'number' && (
                        <Hovered
                            height={iconContainerHeight}
                            shape={shape}
                            state={state}
                            underlayColor={underlayColor}
                            width={iconContainerWidth}
                        />
                    )}
                </IconContainer>

                <AnimatedLabelText
                    style={{color: labelColor, height: labelHeight}}
                    testID={`navigationBarItem__label--${id}`}
                    active={active}>
                    {labelText}
                </AnimatedLabelText>
            </Container>
        );
    };

    return <ItemBase {...props} render={render} />;
});

export const Item: FC<ItemProps> = memo(ForwardRefItem);
