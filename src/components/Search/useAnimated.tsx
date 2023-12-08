import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';

export interface UseAnimatedOptions {
    value?: string;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {value} = options;
    const [innerHeightAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const innerHeight = innerHeightAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.adaptSize(56), theme.adaptSize(216)],
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

    useEffect(() => {
        processAnimatedTiming(innerHeightAnimated, value ? 1 : 0);
    }, [innerHeightAnimated, processAnimatedTiming, value]);

    return {innerHeight};
};
