import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../utils/animatedTiming.utils';

export interface UseAnimatedOptions {
    listVisible?: boolean;
}

export interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    innerHeightAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {innerHeightAnimated, listVisible}: ProcessAnimatedTimingOptions,
) =>
    requestAnimationFrame(() =>
        animatedTiming(innerHeightAnimated, {toValue: listVisible ? 1 : 0}).start(),
    );

export const useAnimated = ({listVisible}: UseAnimatedOptions) => {
    const [innerHeightAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);
    const innerHeight = innerHeightAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.adaptSize(theme.spacing.small * 7),
            theme.adaptSize(theme.spacing.small * 40),
        ],
    });

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {innerHeightAnimated, listVisible});
    }, [animatedTiming, innerHeightAnimated, listVisible]);

    return [{innerHeight}];
};
