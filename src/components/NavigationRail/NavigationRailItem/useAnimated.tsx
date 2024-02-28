import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../../utils/animatedTiming.utils';
import {RenderProps} from './NavigationRailItemBase';

interface UseAnimatedOptions extends Pick<RenderProps, 'active' | 'block'> {
    defaultActive?: boolean;
}

interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    labelAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {block, active, labelAnimated}: ProcessAnimatedTimingOptions,
) => {
    !block &&
        typeof active === 'boolean' &&
        requestAnimationFrame(() => {
            animatedTiming(labelAnimated, {
                toValue: active ? 1 : 0,
            }).start();
        });
};

export const useAnimated = ({active, block}: UseAnimatedOptions) => {
    const [labelAnimated] = useAnimatedValue(block || active ? 1 : 0);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);
    const height = labelAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, theme.typography.label.medium.lineHeight],
    });

    const color = labelAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.color.convertHexToRGBA(theme.palette.surface.onSurfaceVariant, 1),
            theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 1),
        ],
    });

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {active, block, labelAnimated});
    }, [active, animatedTiming, block, labelAnimated]);

    return [{height, color}];
};
