import {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, View, ViewProps, ViewStyle} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {State} from '../common/interface';
import {BaseHovered, RenderProps} from './BaseHovered';
import {Container} from './Hovered.styles';

export interface HoveredProps extends Partial<ViewProps & RefAttributes<View>> {
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
