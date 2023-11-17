import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {ElevationProps} from './Elevation';

export type UseAnimatedOptions = Pick<ElevationProps, 'level'>;
export interface ProcessAnimatedTimingOptions {
    animatedValue: Animated.Value;
}

export const useAnimated = ({level}: UseAnimatedOptions) => {
    const [shadowAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const shadow0Opacity = shadowAnimated.interpolate({
        inputRange: [0, 1, 2, 3, 4, 5],
        outputRange: [
            theme.elevation.level0.shadow0.opacity,
            theme.elevation.level1.shadow0.opacity,
            theme.elevation.level2.shadow0.opacity,
            theme.elevation.level3.shadow0.opacity,
            theme.elevation.level4.shadow0.opacity,
            theme.elevation.level5.shadow0.opacity,
        ],
    });

    const shadow1Opacity = shadowAnimated.interpolate({
        inputRange: [0, 1, 2, 3, 4, 5],
        outputRange: [
            theme.elevation.level0.shadow1.opacity,
            theme.elevation.level1.shadow1.opacity,
            theme.elevation.level2.shadow1.opacity,
            theme.elevation.level3.shadow1.opacity,
            theme.elevation.level4.shadow1.opacity,
            theme.elevation.level5.shadow1.opacity,
        ],
    });

    const processAnimatedTiming = useCallback(
        (toValue: UseAnimatedOptions['level'], {animatedValue}: ProcessAnimatedTimingOptions) => {
            const animatedTiming = UTIL.animatedTiming(theme);
            const animated = () =>
                requestAnimationFrame(() =>
                    animatedTiming(animatedValue, {
                        duration: 'short3',
                        easing: 'standard',
                        toValue: toValue ?? 0,
                    }).start(),
                );

            animated();
        },
        [theme],
    );

    useEffect(() => {
        processAnimatedTiming(level, {animatedValue: shadowAnimated});
    }, [shadowAnimated, level, processAnimatedTiming]);

    return {shadow0Opacity, shadow1Opacity};
};
