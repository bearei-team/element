import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';

export interface UseAnimatedOptions {
    listVisible?: boolean;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {listVisible} = options;
    const [innerHeightAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const innerHeight = innerHeightAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.adaptSize(theme.spacing.small * 7),
            theme.adaptSize(theme.spacing.small * 27),
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
        processAnimatedTiming(innerHeightAnimated, listVisible ? 1 : 0);
    }, [innerHeightAnimated, processAnimatedTiming, listVisible]);

    return {innerHeight};
};
