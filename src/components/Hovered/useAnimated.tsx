import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {HoveredProps} from './Hovered';

export type UseAnimatedOptions = Pick<HoveredProps, 'state'>;

export interface ProcessAnimatedTimingOptions {
    animatedValue: Animated.Value;
}

export const useAnimated = ({state}: UseAnimatedOptions) => {
    const [opacityAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const opacity = opacityAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, state === 'focused' ? 0.12 : 0.08],
    });

    const processAnimatedTiming = useCallback(
        (toValue: number, {animatedValue}: ProcessAnimatedTimingOptions) => {
            const animatedTiming = UTIL.animatedTiming(theme);
            const animated = () =>
                requestAnimationFrame(() =>
                    animatedTiming(animatedValue, {
                        duration: 'short3',
                        easing: 'standard',
                        toValue,
                    }).start(),
                );

            animated();
        },
        [theme],
    );

    useEffect(() => {
        if (state) {
            processAnimatedTiming(state === 'hovered' || state === 'focused' ? 1 : 0, {
                animatedValue: opacityAnimated,
            });
        }
    }, [opacityAnimated, processAnimatedTiming, state]);

    return {opacity};
};
