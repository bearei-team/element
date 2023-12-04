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
        const {children, id, level, onMainLayout, renderStyle, shape, ...containerProps} =
            renderProps;

        const {mainHeight, opacity0, opacity1, mainWidth} = renderStyle;

        return (
            <Container
                {...containerProps}
                height={mainHeight}
                ref={ref}
                testID={`elevation--${id}`}
                width={mainWidth}>
                <Main onLayout={onMainLayout} shape={shape} testID={`elevation__main--${id}`}>
                    {children}
                </Main>

                {typeof mainWidth === 'number' && (
                    <>
                        <AnimatedShadow0
                            height={mainHeight}
                            level={level}
                            shadow={0}
                            shape={shape}
                            style={{opacity: opacity0}}
                            testID={`elevation__shadow0--${id}`}
                            width={mainWidth}
                        />

                        <AnimatedShadow1
                            height={mainHeight}
                            level={level}
                            shadow={1}
                            shape={shape}
                            style={{opacity: opacity1}}
                            testID={`elevation__shadow1--${id}`}
                            width={mainWidth}
                        />
                    </>
                )}
            </Container>
        );
    };

    return <ElevationBase {...props} render={render} />;
});

export const Elevation: FC<ElevationProps> = memo(ForwardRefElevation);
