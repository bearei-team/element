import {useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../utils/animatedTiming.utils';

interface UseAnimatedOptions {
    listVisible?: boolean;
    onListClosed: (visible?: boolean) => void;
}

interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    listHeightAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {listHeightAnimated, listVisible, onListClosed}: ProcessAnimatedTimingOptions,
) =>
    requestAnimationFrame(() =>
        animatedTiming(listHeightAnimated, {toValue: listVisible ? 1 : 0}).start(
            () => !listVisible && onListClosed(listVisible),
        ),
    );

export const useAnimated = ({listVisible, onListClosed}: UseAnimatedOptions) => {
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
        processAnimatedTiming(animatedTiming, {listHeightAnimated, listVisible, onListClosed});
    }, [animatedTiming, listHeightAnimated, listVisible, onListClosed]);

    return [{listHeight}];
};
