import {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, View, ViewProps} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {EventName} from '../Common/interface';
import {Container} from './Hovered.styles';
import {HoveredBase, RenderProps} from './HoveredBase';

export interface HoveredProps
    extends Partial<
        ViewProps &
            RefAttributes<Animated.LegacyRef<View>> &
            Pick<ShapeProps, 'shape'>
    > {
    eventName?: EventName;
    height?: number;
    opacities?: [number, number, number] | [number, number];
    underlayColor?: string;
    width?: number;
}

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const ForwardRefHovered = forwardRef<Animated.LegacyRef<View>, HoveredProps>(
    (props, ref) => {
        const render = (renderProps: RenderProps) => {
            const {id, renderStyle, style, underlayColor, ...containerProps} =
                renderProps;

            const {width, height, ...containerStyle} = renderStyle;

            return (
                <AnimatedContainer
                    {...containerProps}
                    height={height}
                    style={{
                        ...(typeof style === 'object' && style),
                        ...containerStyle,
                    }}
                    testID={`hovered--${id}`}
                    width={width}
                    underlayColor={underlayColor}
                />
            );
        };

        return <HoveredBase {...props} ref={ref} render={render} />;
    },
);

export const Hovered: FC<HoveredProps> = memo(ForwardRefHovered);
