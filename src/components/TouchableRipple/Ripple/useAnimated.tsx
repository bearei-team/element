import {useCallback, useEffect} from 'react';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {UTIL} from '../../../utils/util';
import {RippleProps} from './Ripple';

export interface UseAnimatedOptions extends Pick<RippleProps, 'onAnimatedEnd' | 'sequence'> {
    minDuration: number;
}

export const useAnimated = ({minDuration, onAnimatedEnd, sequence}: UseAnimatedOptions) => {
    const theme = useTheme();
    const [scaleAnimated] = useAnimatedValue(0);
    const [opacityAnimated] = useAnimatedValue(0);
    const scale = scaleAnimated.interpolate({inputRange: [0, 1], outputRange: [0.1, 1]});
    const opacity = opacityAnimated.interpolate({inputRange: [0, 1], outputRange: [1, 0]});
    const processAnimatedTiming = useCallback(() => {
        const animatedTiming = UTIL.animatedTiming(theme);
        const animatedIn = (finished: () => void) =>
            requestAnimationFrame(() =>
                animatedTiming(scaleAnimated, {
                    toValue: 1,
                    easing: 'emphasized',
                    duration: Math.min(minDuration, 200),
                }).start(finished),
            );

        const animatedOut = (finished: () => void) =>
            requestAnimationFrame(() =>
                animatedTiming(opacityAnimated, {
                    toValue: 1,
                    easing: 'emphasized',
                    duration: 'short3',
                }).start(finished),
            );

        const finished = () => onAnimatedEnd?.(sequence ?? 'undefined', animatedOut);

        animatedIn(finished);
    }, [minDuration, onAnimatedEnd, opacityAnimated, scaleAnimated, sequence, theme]);

    useEffect(() => {
        processAnimatedTiming();
    }, [processAnimatedTiming]);

    return {scale, opacity};
};
