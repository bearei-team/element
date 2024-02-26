import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater} from 'use-immer';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../../utils/animatedTiming.utils';
import {InitialState} from './TabItemBase';

interface UseAnimatedOptions {
    active?: boolean;
    defaultActive?: boolean;
    setState: Updater<InitialState>;
}

interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    activeAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {active, activeAnimated, setState}: ProcessAnimatedTimingOptions,
) =>
    typeof active === 'boolean' &&
    setState(draft => {
        draft.status === 'succeeded' &&
            requestAnimationFrame(() =>
                animatedTiming(activeAnimated, {toValue: active ? 1 : 0}).start(),
            );
    });

export const useAnimated = ({active, defaultActive, setState}: UseAnimatedOptions) => {
    const [activeAnimated] = useAnimatedValue(defaultActive ? 1 : 0);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);
    const color = activeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.palette.surface.onSurface, theme.palette.primary.primary],
    });

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {active, activeAnimated, setState});
    }, [active, activeAnimated, animatedTiming, setState]);

    return [{color}];
};
