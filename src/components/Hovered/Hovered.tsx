import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Container} from './Hovered.styles';
import {HoveredBase, HoveredProps, RenderProps} from './HoveredBase';

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const render = ({id, renderStyle, style, underlayColor, ...containerProps}: RenderProps) => {
    const {width, height, opacity} = renderStyle;

    return (
        <AnimatedContainer
            {...containerProps}
            renderStyle={{width, height}}
            style={{...(typeof style === 'object' && style), opacity}}
            testID={`hovered--${id}`}
            underlayColor={underlayColor}
        />
    );
};

const ForwardRefHovered = forwardRef<Animated.LegacyRef<View>, HoveredProps>((props, ref) => (
    <HoveredBase {...props} ref={ref} render={render} />
));

export const Hovered: FC<HoveredProps> = memo(ForwardRefHovered);
export type {HoveredProps};
