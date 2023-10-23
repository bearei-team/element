import {FC, useCallback, useEffect, useId} from 'react';
import {Animated, I18nManager, View, ViewProps} from 'react-native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {UTIL} from '../../../utils/util';
import {useTheme} from 'styled-components/native';
import {RippleProps} from './Ripple';

export interface RenderProps extends Animated.AnimatedProps<ViewProps & React.RefAttributes<View>> {
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
    touchableEvent,
    touchableLayout,
    onAnimatedEnd,
    render,
    ...args
}): React.JSX.Element => {
    const id = useId();
    const theme = useTheme();
    const [scaleAnimated] = useAnimatedValue(0);
    const [opacityAnimated] = useAnimatedValue(0);
    const {width, height} = touchableLayout;
    const centerX = width / 2;
    const centerY = height / 2;
    const {locationX, locationY} = centered
        ? {locationX: centerX, locationY: centerY}
        : touchableEvent;

    const offsetX = Math.abs(centerX - locationX);
    const offsetY = Math.abs(centerY - locationY);
    const radius = Math.sqrt(Math.pow(centerX + offsetX, 2) + Math.pow(centerY + offsetY, 2));
    const scale = scaleAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0.1, 1],
    });

    const opacity = opacityAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
    });

    const processAnimatedTiming = useCallback((): void => {
        const animatedTiming = UTIL.animatedTiming(theme);
        const animatedIn = (finished: () => void): number =>
            requestAnimationFrame(() =>
                animatedTiming(scaleAnimated, {
                    toValue: 1,
                    easing: 'standard',
                    duration: Math.min(radius * 2, 350),
                }).start(finished),
            );

        const animatedOut = (finished: () => void): number =>
            requestAnimationFrame(() =>
                animatedTiming(opacityAnimated, {
                    toValue: 1,
                    easing: 'standard',
                    duration: 'short3',
                }).start(finished),
            );

        const finished = (): void => onAnimatedEnd?.(sequence ?? id, animatedOut);

        animatedIn(finished);
    }, [id, onAnimatedEnd, opacityAnimated, radius, scaleAnimated, sequence, theme]);

    const ripple = render({
        ...args,
        id,
        x: locationX,
        y: locationY,
        width: radius * 2,
        hight: radius * 2,
        isRTL: I18nManager.isRTL,
        underlayColor,
        style: {opacity, transform: [{translateY: -radius}, {translateX: -radius}, {scale}]},
    });

    useEffect(() => {
        processAnimatedTiming();
    }, [processAnimatedTiming]);

    return ripple;
};
