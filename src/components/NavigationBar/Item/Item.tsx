import {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, PressableProps, View} from 'react-native';
import {ShapeProps} from '../../Common/Common.styles';
import {State} from '../../Common/interface';
import {Hovered} from '../../Hovered/Hovered';
import {Container, Icon, IconContainer, IconInner, LabelText} from './Item.styles';
import {ItemBase, RenderProps} from './ItemBase';

export interface ItemProps
    extends Partial<PressableProps & RefAttributes<View> & Pick<ShapeProps, 'shape'>> {
    active?: boolean;
    activeIcon?: React.JSX.Element;
    icon?: React.JSX.Element;
    labelText?: string;
    state?: State;
}

const AnimatedIconInner = Animated.createAnimatedComponent(IconInner);
const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const ForwardRefItem = forwardRef<View, ItemProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            active,
            activeIcon,
            icon,
            id,
            labelText,
            onIconContainerLayout,
            renderStyle,
            shape,
            state,
            underlayColor,
            ...containerProps
        } = renderProps;

        const {
            iconContainerHeight,
            iconContainerWidth,
            backgroundColor,
            labelWeight,
            labelColor,
            iconInnerWidth,
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
                    onLayout={onIconContainerLayout}
                    testID={`navigationBarItem__iconContainer--${id}`}>
                    <AnimatedIconInner
                        shape={shape}
                        style={{backgroundColor, width: iconInnerWidth}}
                        testID={`navigationBarItem__iconInner--${id}`}>
                        <Icon testID={`navigationBarItem__icon--${id}`}>
                            {active ? activeIcon : icon}
                        </Icon>
                    </AnimatedIconInner>

                    <Hovered
                        height={iconContainerHeight}
                        shape={shape}
                        state={state}
                        underlayColor={underlayColor}
                        width={iconContainerWidth}
                    />
                </IconContainer>

                <AnimatedLabelText
                    style={{fontWeight: labelWeight, color: labelColor, height: labelHeight}}
                    testID={`navigationBarItem__label--${id}`}>
                    {labelText}
                </AnimatedLabelText>
            </Container>
        );
    };

    return <ItemBase {...props} render={render} />;
});

export const Item: FC<ItemProps> = memo(ForwardRefItem);
