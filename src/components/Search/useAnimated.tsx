import {useCallback} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';

export interface UseAnimatedOptions {}

export const useAnimated = (options: UseAnimatedOptions) => {
    const [opacityAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const height = opacityAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [56, 273],
    });

    const processAnimatedTiming = useCallback(
        (animation: Animated.Value, toValue: number) => {
            const animatedTiming = UTIL.animatedTiming(theme);

            requestAnimationFrame(() =>
                animatedTiming(animation, {
                    duration: 'short3',
                    easing: 'standard',
                    toValue,
                }).start(),
            );
        },
        [theme],
    );

    return {height};
};
