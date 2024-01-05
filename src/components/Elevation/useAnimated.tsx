import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {ElevationProps} from './Elevation';

export type UseAnimatedOptions = Pick<ElevationProps, 'level' | 'defaultLevel'>;

export const useAnimated = (options: UseAnimatedOptions) => {
    const {level, defaultLevel = 0} = options;
    const [shadowAnimated] = useAnimatedValue(defaultLevel);
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
        (
            animation: Animated.Value,
            toValue: UseAnimatedOptions['level'] = 0,
        ) => {
            const animatedTiming = UTIL.animatedTiming(theme);

            requestAnimationFrame(() =>
                animatedTiming(animation, {
                    duration: 'short3',
                    easing: 'standard',
                    toValue,
                    useNativeDriver: true,
                }).start(),
            );
        },
        [theme],
    );

    useEffect(() => {
        typeof level === 'number' &&
            processAnimatedTiming(shadowAnimated, level);
    }, [level, processAnimatedTiming, shadowAnimated]);

    return {shadow0Opacity, shadow1Opacity};
};
