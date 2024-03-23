import {FC, forwardRef, memo} from 'react';
import {View} from 'react-native';
import Animated from 'react-native-reanimated';
import {Container} from './Hovered.styles';
import {HoveredBase, HoveredProps, RenderProps} from './HoveredBase';

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const render = ({id, renderStyle, style, underlayColor, ...containerProps}: RenderProps) => {
    const {width, height, ...containerStyle} = renderStyle;

    return (
        <AnimatedContainer
            {...containerProps}
            renderStyle={{width, height}}
            style={{...(typeof style === 'object' && style), ...containerStyle}}
            testID={`hovered--${id}`}
            underlayColor={underlayColor}
        />
    );
};

const ForwardRefHovered = forwardRef<View, HoveredProps>((props, ref) => (
    <HoveredBase {...props} ref={ref} render={render} />
));

export const Hovered: FC<HoveredProps> = memo(ForwardRefHovered);
export type {HoveredProps};
