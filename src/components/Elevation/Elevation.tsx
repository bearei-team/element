import {FC, forwardRef, memo} from 'react';
import {View} from 'react-native';
import Animated from 'react-native-reanimated';
import {Container, Shadow} from './Elevation.styles';
import {ElevationBase, ElevationLevel, ElevationProps, RenderProps} from './ElevationBase';

const AnimatedShadow = Animated.createAnimatedComponent(Shadow);
const render = ({id, level, renderStyle, shape, ...containerProps}: RenderProps) => {
    const {height, opacity0, opacity1, width} = renderStyle;

    return (
        <Container {...containerProps} renderStyle={{width, height}} testID={`elevation--${id}`}>
            <AnimatedShadow
                level={level}
                renderStyle={{width, height}}
                shadowIndex={0}
                shape={shape}
                style={{opacity: opacity0}}
                testID={`elevation__shadow0--${id}`}
            />

            <AnimatedShadow
                level={level}
                renderStyle={{width, height}}
                shadowIndex={1}
                shape={shape}
                style={{opacity: opacity1}}
                testID={`elevation__shadow1--${id}`}
            />
        </Container>
    );
};

const ForwardRefElevation = forwardRef<View, ElevationProps>((props, ref) => (
    <ElevationBase {...props} ref={ref} render={render} />
));

export const Elevation: FC<ElevationProps> = memo(ForwardRefElevation);
export type {ElevationLevel, ElevationProps};
