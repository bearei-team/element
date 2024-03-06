import {useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../utils/animatedTiming.utils';

interface UseAnimatedOptions {
    listVisible?: boolean;
}

interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    listHeightAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {listHeightAnimated, listVisible}: ProcessAnimatedTimingOptions,
) =>
    requestAnimationFrame(() =>
        animatedTiming(listHeightAnimated, {toValue: listVisible ? 1 : 0}).start(),
    );

export const useAnimated = ({listVisible}: UseAnimatedOptions) => {
    const [listHeightAnimated] = useAnimatedValue(listVisible ? 1 : 0);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);
    const listHeight = useMemo(
        () =>
            listHeightAnimated.interpolate({
                inputRange: [0, 1],
                outputRange: [
                    theme.adaptSize(theme.spacing.none),
                    theme.adaptSize(theme.spacing.small * 40),
                ],
            }),
        [listHeightAnimated, theme],
    );

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {listHeightAnimated, listVisible});
    }, [animatedTiming, listHeightAnimated, listVisible]);

    return [{listHeight}];
};
