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
    const [stateChangeAnimated] = useAnimatedValue(0);
    const [labelHeightAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const iconBackgroundColor = stateChangeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.color.rgba(theme.palette.secondary.secondaryContainer, 0),
            theme.palette.secondary.secondaryContainer,
        ],
    });

    const iconBackgroundWidth = stateChangeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.adaptSize(24),
            theme.adaptSize(
                24 + (theme.spacing.large - theme.spacing.extraSmall) * 2,
            ),
        ],
    });

    const labelColor = stateChangeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.palette.surface.onSurfaceVariant,
            theme.palette.surface.onSurface,
        ],
    });

    const labelHeight = labelHeightAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            0,
            theme.adaptSize(theme.typography.label.medium.lineHeight),
        ],
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

        processAnimatedTiming(stateChangeAnimated, toValue);
        processAnimatedTiming(labelHeightAnimated, toValue);
    }, [
        active,
        labelHeightAnimated,
        processAnimatedTiming,
        stateChangeAnimated,
    ]);

    useEffect(() => {
        processAnimatedTiming(labelHeightAnimated, block ? 1 : 0);
    }, [block, labelHeightAnimated, processAnimatedTiming]);

    return {iconBackgroundColor, labelColor, iconBackgroundWidth, labelHeight};
};
