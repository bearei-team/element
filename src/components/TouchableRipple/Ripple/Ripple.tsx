import {FC, forwardRef, memo} from 'react';
import {
    Animated,
    LayoutRectangle,
    NativeTouchEvent,
    View,
    ViewProps,
} from 'react-native';
import {Container} from './Ripple.styles';
import {RenderProps, RippleBase} from './RippleBase';

export interface RippleProps
    extends Partial<ViewProps & React.RefAttributes<View>> {
    active?: boolean;
    centered?: boolean;
    defaultActive?: boolean;
    location?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    onEntryAnimatedEnd?: (
        sequence: string,
        exitAnimated: (finished?: () => void) => void,
    ) => void;

    sequence?: string;
    touchableLayout?: LayoutRectangle;
    underlayColor?: string;
}

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const ForwardRefRipple = forwardRef<View, RippleProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            active,
            defaultActive,
            id,
            renderStyle,
            style,
            x,
            y,
            ...containerProps
        } = renderProps;

        const {height, width, ...containerStyle} = renderStyle;
        const activeRipple = [typeof active, typeof defaultActive].includes(
            'boolean',
        );

        return (
            <AnimatedContainer
                {...containerProps}
                activeRipple={activeRipple}
                height={height}
                shape="full"
                style={{
                    ...(typeof style === 'object' && style),
                    ...containerStyle,
                }}
                testID={`ripple--${id}`}
                width={width}
                x={x}
                y={y}
            />
        );
    };

    return <RippleBase {...props} render={render} ref={ref} />;
});

export const Ripple: FC<RippleProps> = memo(ForwardRefRipple);
