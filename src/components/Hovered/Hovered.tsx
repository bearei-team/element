import {Animated, View, ViewProps, ViewStyle} from 'react-native';
import {BaseHovered, RenderProps} from './BaseHovered';
import {Container} from './Hovered.styles';
import {FC, forwardRef, memo} from 'react';
import {State} from '../common/interface';
import {ShapeProps} from '../Common/Shape.styles';

export interface HoveredProps
    extends Animated.AnimatedProps<ViewProps & React.RefAttributes<View>> {
    width?: number;
    height?: number;
    underlayColor?: string;
    opacity?: number;
    state?: State;
    disabled?: boolean;
    shapeProps?: ShapeProps;
}

const ForwardRefHovered = forwardRef<View | Animated.LegacyRef<View>, HoveredProps>(
    (props, ref) => {
        const AnimatedContainer = Animated.createAnimatedComponent(Container);
        const render = ({id, shapeProps, width, height, style, ...containerProps}: RenderProps) => (
            <>
                {width !== 0 && (
                    <AnimatedContainer
                        {...{...shapeProps, ...containerProps}}
                        ref={ref}
                        testID={`hovered--${id}`}
                        style={{
                            ...(style as Animated.WithAnimatedObject<ViewStyle>),
                            width,
                            height,
                        }}
                    />
                )}
            </>
        );

        return <BaseHovered {...props} render={render} />;
    },
);

export const Hovered: FC<HoveredProps> = memo(ForwardRefHovered);
