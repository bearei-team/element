import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {UTIL} from '../../../utils/util';

export interface ProcessAnimatedTimingOptions {
    animatedValue: Animated.Value;
}

export interface UseAnimatedOptions {
    active: boolean;
}

export const useAnimated = ({active}: UseAnimatedOptions) => {
    const [stateAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const backgroundColor = stateAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.color.rgba(theme.palette.secondary.onSecondaryContainer, 0),
            theme.palette.secondary.secondaryContainer,
        ],
    });

    const paddingHorizontal = stateAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [24, 64],
    });

    const labelWeight = stateAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [500, 600],
    });

    const labelColor = stateAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.palette.surface.onSurfaceVariant, theme.palette.surface.onSurface],
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
        processAnimatedTiming(active ? 1 : 0, {animatedValue: stateAnimated});
    }, [active, processAnimatedTiming, stateAnimated]);

    return {backgroundColor, labelWeight, labelColor, paddingHorizontal};
};
