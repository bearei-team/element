import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../../utils/animatedTiming.utils';

interface UseAnimatedOptions {
    listVisible?: boolean;
}

interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    heightAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {heightAnimated, listVisible}: ProcessAnimatedTimingOptions,
) =>
    requestAnimationFrame(() =>
        animatedTiming(heightAnimated, {toValue: listVisible ? 1 : 0}).start(),
    );

export const useAnimated = ({listVisible}: UseAnimatedOptions) => {
    const [heightAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);
    const height = heightAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.adaptSize(theme.spacing.small * 7),
            theme.adaptSize(theme.spacing.small * 40),
        ],
    });

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {heightAnimated, listVisible});
    }, [animatedTiming, heightAnimated, listVisible]);

    return [{height}];
};
