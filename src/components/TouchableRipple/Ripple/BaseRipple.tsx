import {FC, useCallback, useEffect, useId} from 'react';
import {I18nManager, View, ViewProps} from 'react-native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {UTIL} from '../../../utils/util';
import {useTheme} from 'styled-components/native';
import {RippleProps} from './Ripple';
export interface RenderProps extends Partial<ViewProps & React.RefAttributes<View>> {
    x: number;
    y: number;
    width: number;
    hight: number;
    isRTL: boolean;
    underlayColor: RippleProps['underlayColor'];
}

export interface BaseRippleProps extends RippleProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseRipple: FC<BaseRippleProps> = ({
    sequence,
    centered = false,
    underlayColor,
    location,
    touchableLayout,
    onAnimatedEnd,
    render,
    ...renderProps
}) => {
    const id = useId();
    const theme = useTheme();
    const [scaleAnimated] = useAnimatedValue(0);
    const [opacityAnimated] = useAnimatedValue(0);
    const {width, height} = touchableLayout;
    const centerX = width / 2;
    const centerY = height / 2;
    const {locationX, locationY} = centered ? {locationX: centerX, locationY: centerY} : location;
    const offsetX = Math.abs(centerX - locationX);
    const offsetY = Math.abs(centerY - locationY);
    const radius = Math.sqrt(Math.pow(centerX + offsetX, 2) + Math.pow(centerY + offsetY, 2));
    const rippleScale = scaleAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0.1, 1],
    });

    const rippleOpacity = opacityAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
    });

    const processAnimatedTiming = useCallback(() => {
        const animatedTiming = UTIL.animatedTiming(theme);
        const animatedIn = (finished: () => void) =>
            requestAnimationFrame(() =>
                animatedTiming(scaleAnimated, {
                    toValue: 1,
                    easing: 'standard',
                    duration: Math.min(radius * 2, 200),
                }).start(finished),
            );

        const animatedOut = (finished: () => void) =>
            requestAnimationFrame(() =>
                animatedTiming(opacityAnimated, {
                    toValue: 1,
                    easing: 'standard',
                    duration: 'short3',
                }).start(finished),
            );

        const finished = () => onAnimatedEnd?.(sequence ?? id, animatedOut);

        animatedIn(finished);
    }, [id, onAnimatedEnd, opacityAnimated, radius, scaleAnimated, sequence, theme]);

    useEffect(() => {
        processAnimatedTiming();
    }, [processAnimatedTiming]);

    return render({
        ...renderProps,
        id,
        x: locationX,
        y: locationY,
        width: radius * 2,
        hight: radius * 2,
        isRTL: I18nManager.isRTL,
        underlayColor,
        style: {
            opacity: rippleOpacity,
            transform: [{translateY: -radius}, {translateX: -radius}, {scale: rippleScale}],
        },
    });
};
