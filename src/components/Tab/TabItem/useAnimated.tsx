import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {HOOK} from '../../../hooks/hook';
import {AnimatedTiming} from '../../../utils/animatedTiming.utils';
import {UTIL} from '../../../utils/util';

export interface UseAnimatedOptions {
    active?: boolean;
    defaultActive?: boolean;
}

export interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    activeAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {active, activeAnimated}: ProcessAnimatedTimingOptions,
) =>
    typeof active === 'boolean' &&
    requestAnimationFrame(() => animatedTiming(activeAnimated, {toValue: active ? 1 : 0}).start());

export const useAnimated = ({active, defaultActive}: UseAnimatedOptions) => {
    const [activeAnimated] = HOOK.useAnimatedValue(defaultActive ? 1 : 0);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const color = activeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.palette.surface.onSurface, theme.palette.primary.primary],
    });

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {active, activeAnimated});
    }, [active, activeAnimated, animatedTiming]);

    return [{color}];
};
