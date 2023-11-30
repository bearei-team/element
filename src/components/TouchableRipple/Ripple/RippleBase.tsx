import {FC, useId} from 'react';
import {Animated, ViewStyle} from 'react-native';
import {RippleProps} from './Ripple';
import {useAnimated} from './useAnimated';
export interface RenderProps extends Partial<RippleProps> {
    renderStyle: Animated.WithAnimatedObject<ViewStyle & {height: number; width: number}>;
    underlayColor: RippleProps['underlayColor'];
    x: number;
    y: number;
}

export interface RippleBaseProps extends RippleProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const RippleBase: FC<RippleBaseProps> = props => {
    const {
        centered = false,
        location,
        onAnimatedEnd,
        render,
        sequence,
        touchableLayout,
        underlayColor,
        ...renderProps
    } = props;

    const {width, height} = touchableLayout;
    const centerX = width / 2;
    const centerY = height / 2;
    const id = useId();
    const {locationX, locationY} = centered ? {locationX: centerX, locationY: centerY} : location;
    const offsetX = Math.abs(centerX - locationX);
    const offsetY = Math.abs(centerY - locationY);
    const radius = Math.sqrt(Math.pow(centerX + offsetX, 2) + Math.pow(centerY + offsetY, 2));
    const diameter = radius * 2;
    const {opacity, scale} = useAnimated({minDuration: diameter, onAnimatedEnd, sequence});

    return render({
        ...renderProps,
        id,
        renderStyle: {
            height: diameter,
            opacity,
            transform: [{translateY: -radius}, {translateX: -radius}, {scale}],
            width: diameter,
        },
        underlayColor,
        x: locationX,
        y: locationY,
    });
};
