import {FC, forwardRef, memo} from 'react';
import {View} from 'react-native';
import Animated from 'react-native-reanimated';
import {Container} from './Ripple.styles';
import {RenderProps, RippleBase, RippleProps} from './RippleBase';

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const render = ({
    active,
    id,
    locationX,
    locationY,
    renderStyle,
    style,
    ...containerProps
}: RenderProps) => {
    const {height, width, ...containerStyle} = renderStyle;

    return (
        <AnimatedContainer
            {...containerProps}
            active={active}
            locationX={locationX}
            locationY={locationY}
            renderStyle={{height, width}}
            shape="full"
            style={{...(typeof style === 'object' && style), ...containerStyle}}
            testID={`ripple--${id}`}
        />
    );
};

const ForwardRefRipple = forwardRef<View, RippleProps>((props, ref) => (
    <RippleBase {...props} render={render} ref={ref} />
));

export const Ripple: FC<RippleProps> = memo(ForwardRefRipple);
export type {RippleProps};
