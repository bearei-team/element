import {useCallback} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';

export interface UseAnimatedOptions {
    active: boolean;
    block: boolean;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {active, block} = options;
    const [containerAnimated] = useAnimatedValue(0);

    const theme = useTheme();
    const backgroundColor = containerAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.color.rgba(theme.palette.secondary.secondaryContainer, 0),
            theme.palette.secondary.secondaryContainer,
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

    // useEffect(() => {
    //     const toValue = active ? 1 : 0;

    //     processAnimatedTiming(stateAnimated, toValue);
    //     processAnimatedTiming(labelAnimated, toValue);
    // }, [active, labelAnimated, processAnimatedTiming, stateAnimated]);

    // useEffect(() => {
    //     processAnimatedTiming(labelAnimated, block ? 1 : 0);
    // }, [block, labelAnimated, processAnimatedTiming]);

    return {backgroundColor};
};
