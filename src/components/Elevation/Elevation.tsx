import {Animated, View, ViewProps} from 'react-native';
import React, {FC, forwardRef, memo} from 'react';
import {BaseElevation, RenderProps} from './BaseElevation';
import {Container, Main, Shadow0, Shadow1} from './Elevation.styles';
import {ShapeProps} from '../Common/Shape.styles';
export interface ElevationProps extends ViewProps {
    level?: 0 | 1 | 2 | 3 | 4 | 5;
    shapeProps?: ShapeProps;
}

const ForwardRefElevation = forwardRef<View, ElevationProps>((props, ref) => {
    const AnimatedShadow0 = Animated.createAnimatedComponent(Shadow0);
    const AnimatedShadow1 = Animated.createAnimatedComponent(Shadow1);

    const render = ({
        id,
        level,
        shapeProps = {},
        children,
        shadowStyle,
        onLayout,
        ...containerProps
    }: RenderProps) => {
        const {width, height, opacity0, opacity1} = shadowStyle;
        const {border, ...restShapeProps} = shapeProps;

        return (
            <Container
                {...{...restShapeProps, ...containerProps, border}}
                ref={ref}
                testID={`elevation--${id}`}
                style={{width, height}}>
                <Main {...restShapeProps} testID={`elevation__main--${id}`} onLayout={onLayout}>
                    {children}
                </Main>

                {width !== 0 && (
                    <>
                        <AnimatedShadow0
                            {...restShapeProps}
                            testID={`elevation__shadow0--${id}`}
                            level={level}
                            shadow={0}
                            style={{width, height, opacity: opacity0}}
                        />

                        <AnimatedShadow1
                            {...restShapeProps}
                            testID={`elevation__shadow1--${id}`}
                            level={level}
                            shadow={1}
                            style={{width, height, opacity: opacity1}}
                        />
                    </>
                )}
            </Container>
        );
    };

    return <BaseElevation {...props} render={render} />;
});

export const Elevation: FC<ElevationProps> = memo(ForwardRefElevation);
