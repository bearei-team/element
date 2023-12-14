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
    const [scaleAnimated] = useAnimatedValue(1);
    const scale = scaleAnimated.interpolate({inputRange: [0, 1, 2], outputRange: [0.97, 1, 1.03]});
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
        const pressValue = ['pressIn', 'longPressIn'].includes(state) ? 0 : 1;

        processAnimatedTiming(scaleAnimated, state === 'hovered' ? 2 : pressValue);
    }, [processAnimatedTiming, state, scaleAnimated]);

    return {scale};
};
