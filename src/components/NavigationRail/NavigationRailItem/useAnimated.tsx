import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {UTIL} from '../../../utils/util';
import {RenderProps} from './NavigationRailItemBase';

export interface UseAnimatedOptions
    extends Pick<RenderProps, 'active' | 'block'> {
    defaultActive?: boolean;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {active, block, defaultActive} = options;
    const [labelAnimated] = useAnimatedValue(block || defaultActive ? 1 : 0);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const scale = labelAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const color = labelAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.palette.surface.onSurfaceVariant,
            theme.palette.surface.onSurface,
        ],
    });

    const processAnimatedTiming = useCallback(
        (animation: Animated.Value, toValue: number) => {
            requestAnimationFrame(() =>
                animatedTiming(animation, {
                    duration: 'short3',
                    easing: 'standard',
                    toValue,
                }).start(),
            );
        },
        [animatedTiming],
    );

    useEffect(() => {
        if (!block && typeof active === 'boolean') {
            const toValue = active ? 1 : 0;
            processAnimatedTiming(labelAnimated, toValue);
        }
    }, [active, block, labelAnimated, processAnimatedTiming]);

    return {scale, color};
};
