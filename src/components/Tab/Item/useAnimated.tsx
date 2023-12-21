import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {UTIL} from '../../../utils/util';

export interface UseAnimatedOptions {
    active: boolean;
}

export interface ProcessAnimatedTimingOptions {
    toValue: number;
    finished?: () => void;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {active} = options;
    const [activeAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const color = activeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.palette.surface.onSurface,
            theme.palette.primary.primary,
        ],
    });

    const processAnimatedTiming = useCallback(
        (
            animation: Animated.Value,
            processAnimatedTimingOptions: ProcessAnimatedTimingOptions,
        ) => {
            const {toValue, finished} = processAnimatedTimingOptions;
            const animatedTiming = UTIL.animatedTiming(theme);

            requestAnimationFrame(() =>
                animatedTiming(animation, {
                    duration: 'short3',
                    easing: 'standard',
                    toValue,
                }).start(finished),
            );
        },
        [theme],
    );

    useEffect(() => {
        processAnimatedTiming(activeAnimated, {toValue: active ? 1 : 0});
    }, [active, processAnimatedTiming, activeAnimated]);

    return {color};
};
