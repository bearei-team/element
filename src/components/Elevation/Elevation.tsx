import {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, View, ViewProps} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {BaseElevation, RenderProps} from './BaseElevation';
import {Container, Main, Shadow0, Shadow1} from './Elevation.styles';
export interface ElevationProps
    extends Partial<ViewProps & RefAttributes<View> & Pick<ShapeProps, 'shape'>> {
    level?: 0 | 1 | 2 | 3 | 4 | 5;
}

const ForwardRefElevation = forwardRef<View, ElevationProps>((props, ref) => {
    const AnimatedShadow0 = Animated.createAnimatedComponent(Shadow0);
    const AnimatedShadow1 = Animated.createAnimatedComponent(Shadow1);

    const render = ({
        id,
        level,
        shape,
        children,
        shadowStyle,
        onLayout,
        ...containerProps
    }: RenderProps) => {
        const {width, height, opacity0, opacity1} = shadowStyle;

        return (
            <Container
                {...containerProps}
                ref={ref}
                testID={`elevation--${id}`}
                style={{height, width}}>
                <Main testID={`elevation__main--${id}`} onLayout={onLayout} shape={shape}>
                    {children}
                </Main>

                {width !== 0 && (
                    <>
                        <AnimatedShadow0
                            shape={shape}
                            testID={`elevation__shadow0--${id}`}
                            level={level}
                            shadow={0}
                            style={{width, height, opacity: opacity0}}
                        />

                        <AnimatedShadow1
                            shape={shape}
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
