import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {State} from '../Common/interface';

export interface UseAnimatedOptions {
    state: State;
}

export const useAnimated = ({state}: UseAnimatedOptions) => {
    const [opacityAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const opacity = opacityAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, ['pressed', 'focused'].includes(state) ? 0.12 : 0.08],
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
        processAnimatedTiming(
            opacityAnimated,
            ['hovered', 'focused', 'pressed'].includes(state) ? 1 : 0,
        );
    }, [opacityAnimated, processAnimatedTiming, state]);

    return {opacity};
};
