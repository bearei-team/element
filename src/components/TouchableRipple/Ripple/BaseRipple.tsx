import {FC, useId} from 'react';
import {Animated, I18nManager, ViewStyle} from 'react-native';
import {RippleProps} from './Ripple';
import {useAnimated} from './useAnimated';
export interface RenderProps extends Partial<RippleProps> {
    isRTL: boolean;
    renderStyle: Animated.WithAnimatedObject<
        ViewStyle & {
            height: number;
            width: number;
            x: number;
            y: number;
        }
    >;
    underlayColor: RippleProps['underlayColor'];
}

export interface BaseRippleProps extends RippleProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseRipple: FC<BaseRippleProps> = ({
    centered = false,
    location,
    onAnimatedEnd,
    render,
    sequence,
    touchableLayout,
    underlayColor,
    ...renderProps
}) => {
    const id = useId();
    const {width, height} = touchableLayout;
    const centerX = width / 2;
    const centerY = height / 2;
    const {locationX, locationY} = centered ? {locationX: centerX, locationY: centerY} : location;
    const offsetX = Math.abs(centerX - locationX);
    const offsetY = Math.abs(centerY - locationY);
    const radius = Math.sqrt(Math.pow(centerX + offsetX, 2) + Math.pow(centerY + offsetY, 2));
    const diameter = radius * 2;
    const {opacity, scale} = useAnimated({onAnimatedEnd, sequence, minDuration: diameter});

    return render({
        ...renderProps,
        id,
        isRTL: I18nManager.isRTL,
        renderStyle: {
            height: diameter,
            opacity,
            transform: [{translateY: -radius}, {translateX: -radius}, {scale}],
            width: diameter,
            x: locationX,
            y: locationY,
        },
        underlayColor,
    });
};
