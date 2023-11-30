import {FC, forwardRef, memo} from 'react';
import {Animated, LayoutRectangle, NativeTouchEvent, View, ViewProps} from 'react-native';
import {Container} from './Ripple.styles';
import {RenderProps, RippleBase} from './RippleBase';

export type RippleAnimatedOut = (finished?: () => void) => number;
export interface RippleProps extends Partial<ViewProps & React.RefAttributes<View>> {
    centered?: boolean;
    location: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    onAnimatedEnd: (sequence: string, animatedOut: RippleAnimatedOut) => void;
    sequence?: string;
    touchableLayout: Pick<LayoutRectangle, 'width' | 'height'>;
    underlayColor?: string;
}

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const ForwardRefRipple = forwardRef<View, RippleProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, renderStyle, style, x, y, ...containerProps} = renderProps;
        const {height, width, ...containerStyle} = renderStyle;

        return (
            <AnimatedContainer
                {...containerProps}
                height={height}
                ref={ref}
                shape="full"
                style={{...(typeof style === 'object' && style), ...containerStyle}}
                testID={`ripple--${id}`}
                width={width}
                x={x}
                y={y}
            />
        );
    };

    return <RippleBase {...props} render={render} />;
});

export const Ripple: FC<RippleProps> = memo(ForwardRefRipple);
