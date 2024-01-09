import {useEffect} from 'react';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {ElevationProps} from './Elevation';

export type UseAnimatedOptions = Pick<ElevationProps, 'level' | 'defaultLevel'>;

export const useAnimated = (options: UseAnimatedOptions) => {
    const {level, defaultLevel = 0} = options;
    const [opacityAnimated] = useAnimatedValue(defaultLevel);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const shadow0Opacity = opacityAnimated.interpolate({
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

    const shadow1Opacity = opacityAnimated.interpolate({
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

    useEffect(() => {
        if (typeof level === 'number') {
            requestAnimationFrame(() => {
                animatedTiming(opacityAnimated, {toValue: level}).start();
            });
        }
    }, [level, animatedTiming, opacityAnimated]);

    return [{shadow0Opacity, shadow1Opacity}];
};
