import {FC, forwardRef, memo} from 'react';
import {Animated, LayoutChangeEvent, View} from 'react-native';

import {Hovered} from '../../Hovered/Hovered';
import {
    TouchableRipple,
    TouchableRippleProps,
} from '../../TouchableRipple/TouchableRipple';
import {Container, Inner, LabelText} from './TabItem.styles';
import {RenderProps, TabItemBase} from './TabItemBase';

export interface TabItemProps extends TouchableRippleProps {
    activeKey?: string;
    defaultActiveKey?: string;
    indexKey?: string;
    labelText?: string;
    onLabelTextLayout: (event: LayoutChangeEvent, key: string) => void;
    onActive?: (key?: string) => void;
}

const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const ForwardRefTabItem = forwardRef<View, TabItemProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            eventName,
            id,
            labelText,
            onEvent,
            onLabelTextLayout,
            renderStyle,
            underlayColor,
            ...innerProps
        } = renderProps;

        const {width, height, color} = renderStyle;
        const {onLayout, ...onTouchableRippleEvent} = onEvent;

        return (
            <Container testID={`tabTabItem--${id}`} onLayout={onLayout}>
                <TouchableRipple
                    {...onTouchableRippleEvent}
                    underlayColor={underlayColor}>
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
                            height={height}
                            underlayColor={underlayColor}
                            width={width}
                        />
                    </Inner>
                </TouchableRipple>
            </Container>
        );
    };

    return <TabItemBase {...props} ref={ref} render={render} />;
});

export const TabItem: FC<TabItemProps> = memo(ForwardRefTabItem);
