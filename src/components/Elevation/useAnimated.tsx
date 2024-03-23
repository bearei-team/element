import {useEffect} from 'react';
import {
    AnimatableValue,
    SharedValue,
    cancelAnimation,
    interpolate,
    useSharedValue,
} from 'react-native-reanimated';
import {useTheme} from 'styled-components/native';
import {AnimatedTiming, useAnimatedTiming} from '../../hooks/useAnimatedTiming';
import {ElevationProps} from './Elevation';

type UseAnimatedOptions = Pick<ElevationProps, 'level' | 'defaultLevel'>;
interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    opacity: SharedValue<AnimatableValue>;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {opacity, level = 0}: ProcessAnimatedTimingOptions,
) => animatedTiming(opacity, {toValue: level});

export const useAnimated = ({level = 0}: UseAnimatedOptions) => {
    const opacity = useSharedValue(0);
    const theme = useTheme();
    const [animatedTiming] = useAnimatedTiming(theme);
    const shadow0Opacity = interpolate(
        opacity.value,
        [
            theme.elevation.level0.shadow0.opacity,
            theme.elevation.level1.shadow0.opacity,
            theme.elevation.level2.shadow0.opacity,
            theme.elevation.level3.shadow0.opacity,
            theme.elevation.level4.shadow0.opacity,
            theme.elevation.level5.shadow0.opacity,
        ],
        [0, 1, 2, 3, 4, 5],
    );

    const shadow1Opacity = interpolate(
        opacity.value,
        [
            theme.elevation.level0.shadow1.opacity,
            theme.elevation.level1.shadow1.opacity,
            theme.elevation.level2.shadow1.opacity,
            theme.elevation.level3.shadow1.opacity,
            theme.elevation.level4.shadow1.opacity,
            theme.elevation.level5.shadow1.opacity,
        ],
        [0, 1, 2, 3, 4, 5],
    );

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {level, opacity});

        return () => {
            cancelAnimation(opacity);
        };
    }, [animatedTiming, level, opacity]);

    return [{shadow0Opacity, shadow1Opacity}];
};
