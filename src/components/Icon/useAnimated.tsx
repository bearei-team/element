import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {State} from '../Common/interface';

export interface UseAnimatedOptions {
    state: State;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {state} = options;
    const [stateAnimated] = useAnimatedValue(1);
    const scale = stateAnimated.interpolate({inputRange: [0, 1, 2], outputRange: [0.95, 1, 1.05]});
    const theme = useTheme();

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
        const pressedValue = state === 'pressIn' ? 0 : 1;

        processAnimatedTiming(stateAnimated, state === 'hovered' ? 2 : pressedValue);
    }, [processAnimatedTiming, state, stateAnimated]);

    return {scale};
};
