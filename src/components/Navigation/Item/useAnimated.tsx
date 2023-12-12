import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {UTIL} from '../../../utils/util';

export interface UseAnimatedOptions {
    active: boolean;
    block: boolean;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {active, block} = options;
    const [stateAnimated] = useAnimatedValue(0);

    const [labelAnimated] = useAnimatedValue(0);

    const theme = useTheme();

    const iconBackgroundColor = stateAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.color.rgba(theme.palette.secondary.secondaryContainer, 0),
            theme.palette.secondary.secondaryContainer,
        ],
    });

    const iconBackgroundWidth = stateAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.adaptSize(24),
            theme.adaptSize(24 + (theme.spacing.large - theme.spacing.extraSmall) * 2),
        ],
    });

    const labelColor = stateAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.palette.surface.onSurfaceVariant, theme.palette.surface.onSurface],
    });

    const labelHeight = labelAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, theme.adaptSize(theme.typography.label.medium.lineHeight)],
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
        const toValue = active ? 1 : 0;

        processAnimatedTiming(stateAnimated, toValue);
        processAnimatedTiming(labelAnimated, toValue);
    }, [active, labelAnimated, processAnimatedTiming, stateAnimated]);

    useEffect(() => {
        processAnimatedTiming(labelAnimated, block ? 1 : 0);
    }, [block, labelAnimated, processAnimatedTiming]);

    return {iconBackgroundColor, labelColor, iconBackgroundWidth, labelHeight};
};
