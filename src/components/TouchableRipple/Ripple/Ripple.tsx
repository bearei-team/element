import {FC, forwardRef, memo} from 'react';
import {Animated, LayoutRectangle, NativeTouchEvent, View, ViewProps} from 'react-native';
import {Container} from './Ripple.styles';
import {RenderProps, RippleBase} from './RippleBase';

export interface RippleProps extends Partial<ViewProps & React.RefAttributes<View>> {
    active?: boolean;
    centered?: boolean;
    defaultActive?: boolean;
    location?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    onEntryAnimatedEnd?: (sequence: string, exitAnimated: (finished?: () => void) => void) => void;
    sequence: string;
    touchableLayout?: LayoutRectangle;
    underlayColor?: string;
}

const render = ({
    active,
    defaultActive,
    id,
    renderStyle,
    style,
    locationX,
    locationY,
    ...containerProps
}: RenderProps) => {
    const AnimatedContainer = Animated.createAnimatedComponent(Container);
    const {height, width, ...containerStyle} = renderStyle;
    const activeRipple = [typeof active, typeof defaultActive].includes('boolean');

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
            locationX={locationX}
            locationY={locationY}
            testID={`ripple--${id}`}
            width={width}
        />
    );
};

const ForwardRefRipple = forwardRef<View, RippleProps>((props, ref) => (
    <RippleBase {...props} render={render} ref={ref} />
));

export const Ripple: FC<RippleProps> = memo(ForwardRefRipple);
