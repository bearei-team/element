import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {AnimatedTiming, useAnimatedTiming} from '../../../hooks/useAnimatedTiming';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {RenderProps} from './NavigationRailItemBase';

interface UseAnimatedOptions extends Pick<RenderProps, 'active' | 'type'> {
    defaultActive?: boolean;
}

interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    labelAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {type, active, labelAnimated}: ProcessAnimatedTimingOptions,
) => {
    type === 'segment' &&
        typeof active === 'boolean' &&
        animatedTiming(labelAnimated, {
            toValue: active ? 1 : 0,
        }).start();
};

export const useAnimated = ({active, type}: UseAnimatedOptions) => {
    const [labelAnimated] = useAnimatedValue(type === 'block' || active ? 1 : 0);
    const theme = useTheme();
    const [animatedTiming] = useAnimatedTiming(theme);
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
        processAnimatedTiming(animatedTiming, {active, type, labelAnimated});

        return () => {
            labelAnimated.stopAnimation();
        };
    }, [active, animatedTiming, type, labelAnimated]);

    return [{height, color}];
};
