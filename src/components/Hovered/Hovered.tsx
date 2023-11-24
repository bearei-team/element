import {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, View, ViewProps} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {State} from '../Common/interface';
import {BaseHovered, RenderProps} from './BaseHovered';
import {Container} from './Hovered.styles';

export interface HoveredProps
    extends Partial<ViewProps & RefAttributes<View> & Pick<ShapeProps, 'shape'>> {
    height?: number;
    opacity?: number;
    state?: State;
    underlayColor?: string;
    width?: number;
}

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const ForwardRefHovered = forwardRef<View | Animated.LegacyRef<View>, HoveredProps>(
    (props, ref) => {
        const render = ({id, renderStyle, style, ...containerProps}: RenderProps) => {
            const {width, height, ...animatedStyle} = renderStyle;

            return (
                <AnimatedContainer
                    {...containerProps}
                    ref={ref}
                    style={{...(typeof style === 'object' && style), ...animatedStyle}}
                    width={width}
                    height={height}
                    testID={`hovered--${id}`}
                />
            );
        };

        return <BaseHovered {...props} render={render} />;
    },
);

export const Hovered: FC<HoveredProps> = memo(ForwardRefHovered);
