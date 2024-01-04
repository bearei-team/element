import {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, View, ViewProps} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {Container, Content, Shadow} from './Elevation.styles';
import {ElevationBase, RenderProps} from './ElevationBase';

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface ElevationProps
    extends Partial<
        ViewProps & RefAttributes<View> & Pick<ShapeProps, 'shape'>
    > {
    level?: ElevationLevel;
}

const AnimatedShadow = Animated.createAnimatedComponent(Shadow);
const ForwardRefElevation = forwardRef<View, ElevationProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            children,
            id,
            level,
            onEvent,
            renderStyle,
            shape,
            style,
            ...containerProps
        } = renderProps;

        const {onLayout} = onEvent;
        const {height, opacity0, opacity1, width} = renderStyle;

        return (
            <Container
                {...containerProps}
                height={height}
                testID={`elevation--${id}`}
                width={width}>
                <Content
                    onLayout={onLayout}
                    shape={shape}
                    style={style}
                    testID={`elevation__content--${id}`}>
                    {children}
                </Content>

                <AnimatedShadow
                    height={height}
                    level={level}
                    shadow={0}
                    shape={shape}
                    style={{opacity: opacity0}}
                    testID={`elevation__shadow0--${id}`}
                    width={width}
                />

                <AnimatedShadow
                    height={height}
                    level={level}
                    shadow={1}
                    shape={shape}
                    style={{opacity: opacity1}}
                    testID={`elevation__shadow1--${id}`}
                    width={width}
                />
            </Container>
        );
    };

    return <ElevationBase {...props} render={render} ref={ref} />;
});

export const Elevation: FC<ElevationProps> = memo(ForwardRefElevation);
