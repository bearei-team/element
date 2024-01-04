import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {RenderProps} from './IconBase';

export type UseAnimatedOptions = Required<Pick<RenderProps, 'eventName'>>;

export const useAnimated = (options: UseAnimatedOptions) => {
    const {eventName} = options;
    const [scaleAnimated] = useAnimatedValue(1);
    const theme = useTheme();
    const scale = scaleAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0.97, 1, 1.03],
    });

    const processAnimatedTiming = useCallback(
        (animation: Animated.Value, toValue: number) => {
            const animatedTiming = UTIL.animatedTiming(theme);

            requestAnimationFrame(() =>
                animatedTiming(animation, {
                    duration: 'short3',
                    easing: 'standard',
                    toValue,
                    useNativeDriver: true,
                }).start(),
            );
        },
        [theme],
    );

    useEffect(() => {
        const toValue = ['pressIn', 'longPress'].includes(eventName) ? 0 : 1;

        processAnimatedTiming(
            scaleAnimated,
            eventName === 'hoverIn' ? 2 : toValue,
        );
    }, [processAnimatedTiming, eventName, scaleAnimated]);

    return {scale};
};
