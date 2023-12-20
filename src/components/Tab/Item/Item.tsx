import {FC, forwardRef, memo} from 'react';
import {Animated, LayoutChangeEvent, View} from 'react-native';

import {Hovered} from '../../Hovered/Hovered';
import {
    TouchableRipple,
    TouchableRippleProps,
} from '../../TouchableRipple/TouchableRipple';
import {Container, LabelText} from './Item.styles';
import {ItemBase, RenderProps} from './ItemBase';

export interface ItemProps extends TouchableRippleProps {
    active?: boolean;
    indexKey?: string;
    labelText?: string;
    onLabelTextLayout: (event: LayoutChangeEvent, key: string) => void;
}

const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const ForwardRefItem = forwardRef<View, ItemProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            id,
            labelText,
            onLabelTextLayout,
            renderStyle,
            state,
            underlayColor,
            ...containerProps
        } = renderProps;

        const {width, height, color} = renderStyle;

        return (
            <TouchableRipple
                {...containerProps}
                ref={ref}
                underlayColor={underlayColor}>
                <Container
                    testID={`tabItem--${id}`}
                    onLayout={e => console.info(e.nativeEvent.layout)}>
                    <AnimatedLabelText
                        onLayout={onLabelTextLayout}
                        style={{color}}
                        testID={`tabItem__labelText--${id}`}>
                        {labelText}
                    </AnimatedLabelText>

                    {typeof width === 'number' && (
                        <Hovered
                            height={height}
                            state={state}
                            underlayColor={underlayColor}
                            width={width}
                        />
                    )}
                </Container>
            </TouchableRipple>
        );
    };

    return <ItemBase {...props} render={render} />;
});

export const Item: FC<ItemProps> = memo(ForwardRefItem);
