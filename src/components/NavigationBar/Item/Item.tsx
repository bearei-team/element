import {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, PressableProps, View} from 'react-native';
import {State} from '../../Common/interface';
import {Hovered} from '../../Hovered/Hovered';
import {Container, Icon, IconContainer, IconInner, LabelText} from './Item.styles';
import {ItemBase, RenderProps} from './ItemBase';

export interface ItemProps extends Partial<PressableProps & RefAttributes<View>> {
    labelText?: string;
    state?: State;
    icon?: React.JSX.Element;
    active?: boolean;
}

const AnimatedIconInner = Animated.createAnimatedComponent(IconInner);
const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const ForwardRefItem = forwardRef<View, ItemProps>((props, ref) => {
    const render = ({
        id,
        labelText,
        icon,
        active,
        onIconContainerLayout,
        renderStyle,
        state,
        underlayColor,
        ...containerProps
    }: RenderProps) => {
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
            <Container {...containerProps} ref={ref} testID={`navigationBarItem--${id}`}>
                <IconContainer
                    testID={`navigationBarItem__iconContainer--${id}`}
                    onLayout={onIconContainerLayout}>
                    <AnimatedIconInner
                        style={{backgroundColor, width: iconInnerWidth}}
                        shape="full"
                        testID={`navigationBarItem__iconInner--${id}`}>
                        {active ? (
                            <Icon testID={`navigationBarItem__icon--${id}`}>{icon}</Icon>
                        ) : (
                            <Icon testID={`navigationBarItem__icon--${id}`}>{icon}</Icon>
                        )}
                    </AnimatedIconInner>

                    <Hovered
                        height={iconContainerHeight}
                        shape="full"
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
