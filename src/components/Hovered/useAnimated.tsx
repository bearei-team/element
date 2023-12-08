import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {State} from '../Common/interface';

export interface UseAnimatedOptions {
    state: State;
    opacities: [number, number];
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {state, opacities} = options;
    const [opacityAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const opacity = opacityAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            0,
            ['pressIn', 'focused', 'longPressIn'].includes(state) ? opacities[1] : opacities[0],
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
        const active = ['focused', 'pressIn', 'longPressIn'].includes(state);
        const toValue = ['hovered', 'focused', 'pressIn', 'longPressIn'].includes(state) ? 1 : 0;

        processAnimatedTiming(opacityAnimated, !opacities[1] && active ? 0 : toValue);
    }, [opacities, opacityAnimated, processAnimatedTiming, state]);

    return {opacity};
};
