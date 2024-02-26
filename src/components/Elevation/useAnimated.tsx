import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater} from 'use-immer';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../utils/animatedTiming.utils';
import {ElevationProps} from './Elevation';
import {InitialState} from './ElevationBase';

export interface UseAnimatedOptions extends Pick<ElevationProps, 'level' | 'defaultLevel'> {
    setState: Updater<InitialState>;
}

export interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    opacityAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {opacityAnimated, level, setState}: ProcessAnimatedTimingOptions,
) =>
    typeof level === 'number' &&
    setState(draft => {
        if (draft.status !== 'succeeded') {
            return;
        }

        requestAnimationFrame(() => animatedTiming(opacityAnimated, {toValue: level}).start());
    });

export const useAnimated = ({level, defaultLevel = 0, setState}: UseAnimatedOptions) => {
    const [opacityAnimated] = useAnimatedValue(defaultLevel);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);
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
        processAnimatedTiming(animatedTiming, {level, opacityAnimated, setState});
    }, [animatedTiming, level, opacityAnimated, setState]);

    return [{shadow0Opacity, shadow1Opacity}];
};
