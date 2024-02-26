import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Hovered} from '../../Hovered/Hovered';
import {TouchableRipple} from '../../TouchableRipple/TouchableRipple';
import {Container, Inner, LabelText} from './TabItem.styles';
import {RenderProps, TabItemBase, TabItemProps} from './TabItemBase';

const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const render = ({
    eventName,
    id,
    labelText,
    onEvent,
    onLabelTextLayout,
    renderStyle,
    underlayColor,
    ...innerProps
}: RenderProps) => {
    const {width, height, color} = renderStyle;
    const {onLayout, ...onTouchableRippleEvent} = onEvent;

    return (
        <Container testID={`tabTabItem--${id}`} onLayout={onLayout}>
            <TouchableRipple {...onTouchableRippleEvent} underlayColor={underlayColor}>
                <Inner {...innerProps} testID={`tabTabItem__inner--${id}`}>
                    <AnimatedLabelText
                        numberOfLines={1}
                        onLayout={onLabelTextLayout}
                        size="small"
                        style={{color}}
                        testID={`tabTabItem__labelText--${id}`}
                        type="title">
                        {labelText}
                    </AnimatedLabelText>

                    <Hovered
                        eventName={eventName}
                        renderStyle={{width, height}}
                        underlayColor={underlayColor}
                    />
                </Inner>
            </TouchableRipple>
        </Container>
    );
};

const ForwardRefTabItem = forwardRef<View, TabItemProps>((props, ref) => (
    <TabItemBase {...props} ref={ref} render={render} />
));

export const TabItem: FC<TabItemProps> = memo(ForwardRefTabItem);
export type {TabItemProps};
