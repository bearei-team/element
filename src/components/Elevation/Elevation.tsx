import {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, View, ViewProps} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {Container, Content, Shadow} from './Elevation.styles';
import {ElevationBase, RenderProps} from './ElevationBase';

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5 | undefined;

export interface ElevationProps
    extends Partial<ViewProps & RefAttributes<View> & Pick<ShapeProps, 'shape'>> {
    level?: ElevationLevel;
    defaultLevel?: ElevationLevel;
}

const render = ({
    children,
    id,
    level,
    onEvent,
    renderStyle,
    shape,
    ...contentProps
}: RenderProps) => {
    const AnimatedShadow = Animated.createAnimatedComponent(Shadow);
    const {onLayout} = onEvent;
    const {height, opacity0, opacity1, width} = renderStyle;

    return (
        <Container height={height} testID={`elevation--${id}`} width={width}>
            <Content
                {...contentProps}
                onLayout={onLayout}
                shape={shape}
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

const ForwardRefElevation = forwardRef<View, ElevationProps>((props, ref) => (
    <ElevationBase {...props} ref={ref} render={render} />
));

export const Elevation: FC<ElevationProps> = memo(ForwardRefElevation);
