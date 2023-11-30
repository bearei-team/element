import {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, View, ViewProps} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {Container, Main, Shadow0, Shadow1} from './Elevation.styles';
import {ElevationBase, RenderProps} from './ElevationBase';
export interface ElevationProps
    extends Partial<ViewProps & RefAttributes<View> & Pick<ShapeProps, 'shape'>> {
    level?: 0 | 1 | 2 | 3 | 4 | 5;
}

const AnimatedShadow0 = Animated.createAnimatedComponent(Shadow0);
const AnimatedShadow1 = Animated.createAnimatedComponent(Shadow1);
const ForwardRefElevation = forwardRef<View, ElevationProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {children, id, level, onLayout, renderStyle, shape, style, ...containerProps} =
            renderProps;

        const {height, opacity0, opacity1, width} = renderStyle;

        return (
            <Container
                {...containerProps}
                ref={ref}
                style={{...(typeof style === 'object' && style), height, width}}
                testID={`elevation--${id}`}>
                <Main onLayout={onLayout} shape={shape} testID={`elevation__main--${id}`}>
                    {children}
                </Main>

                <AnimatedShadow0
                    level={level}
                    shadow={0}
                    shape={shape}
                    style={{height, opacity: opacity0, width}}
                    testID={`elevation__shadow0--${id}`}
                />

                <AnimatedShadow1
                    level={level}
                    shadow={1}
                    shape={shape}
                    style={{height, opacity: opacity1, width}}
                    testID={`elevation__shadow1--${id}`}
                />
            </Container>
        );
    };

    return <ElevationBase {...props} render={render} />;
});

export const Elevation: FC<ElevationProps> = memo(ForwardRefElevation);
