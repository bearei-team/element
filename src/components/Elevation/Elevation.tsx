import {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, View, ViewProps} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {Container, Content, Shadow} from './Elevation.styles';
import {ElevationBase, RenderProps} from './ElevationBase';
export interface ElevationProps
    extends Partial<ViewProps & RefAttributes<View> & Pick<ShapeProps, 'shape'>> {
    level?: 0 | 1 | 2 | 3 | 4 | 5;
}

const AnimatedShadow = Animated.createAnimatedComponent(Shadow);

const ForwardRefElevation = forwardRef<View, ElevationProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {children, id, level, onContentLayout, renderStyle, shape, ...containerProps} =
            renderProps;

        const {contentHeight, opacity0, opacity1, contentWidth} = renderStyle;

        return (
            <Container
                {...containerProps}
                height={contentHeight}
                ref={ref}
                testID={`elevation--${id}`}
                width={contentWidth}>
                <Content
                    onLayout={onContentLayout}
                    shape={shape}
                    testID={`elevation__content--${id}`}>
                    {children}
                </Content>

                {typeof contentWidth === 'number' && (
                    <>
                        <AnimatedShadow
                            height={contentHeight}
                            level={level}
                            shadow={0}
                            shape={shape}
                            style={{opacity: opacity0}}
                            testID={`elevation__shadow0--${id}`}
                            width={contentWidth}
                        />

                        <AnimatedShadow
                            height={contentHeight}
                            level={level}
                            shadow={1}
                            shape={shape}
                            style={{opacity: opacity1}}
                            testID={`elevation__shadow1--${id}`}
                            width={contentWidth}
                        />
                    </>
                )}
            </Container>
        );
    };

    return <ElevationBase {...props} render={render} />;
});

export const Elevation: FC<ElevationProps> = memo(ForwardRefElevation);
