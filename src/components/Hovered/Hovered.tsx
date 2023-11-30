import {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, View, ViewProps} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {State} from '../Common/interface';
import {Container} from './Hovered.styles';
import {HoveredBase, RenderProps} from './HoveredBase';

export interface HoveredProps
    extends Partial<
        ViewProps & RefAttributes<Animated.LegacyRef<View>> & Pick<ShapeProps, 'shape'>
    > {
    height?: number;
    opacity?: number;
    state?: State;
    underlayColor?: string;
    width?: number;
}

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const ForwardRefHovered = forwardRef<Animated.LegacyRef<View>, HoveredProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, renderStyle, style, ...containerProps} = renderProps;
        const {width, height, ...containerStyle} = renderStyle;

        return (
            <AnimatedContainer
                {...containerProps}
                ref={ref}
                style={{...(typeof style === 'object' && style), ...containerStyle}}
                width={width}
                height={height}
                testID={`hovered--${id}`}
            />
        );
    };

    return <HoveredBase {...props} render={render} />;
});

export const Hovered: FC<HoveredProps> = memo(ForwardRefHovered);
