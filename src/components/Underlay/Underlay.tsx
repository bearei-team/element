import {FC, forwardRef, memo} from 'react';
import {View} from 'react-native';
import Animated from 'react-native-reanimated';
import {Container} from './Underlay.styles';
import {RenderProps, UnderlayBase, UnderlayProps} from './UnderlayBase';

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const render = ({id, renderStyle, style, underlayColor, ...containerProps}: RenderProps) => {
    const {width, height, animatedStyle} = renderStyle;

    return (
        <AnimatedContainer
            {...containerProps}
            renderStyle={{width, height}}
            style={[style, animatedStyle]}
            testID={`hovered--${id}`}
            underlayColor={underlayColor}
        />
    );
};

const ForwardRefUnderlay = forwardRef<View, UnderlayProps>((props, ref) => (
    <UnderlayBase {...props} ref={ref} render={render} />
));

export const Underlay: FC<UnderlayProps> = memo(ForwardRefUnderlay);
export type {UnderlayProps};
