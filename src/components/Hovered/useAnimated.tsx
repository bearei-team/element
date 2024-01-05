import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {EventName} from '../Common/interface';
import {RenderProps} from './HoveredBase';

export type UseAnimatedOptions = Pick<RenderProps, 'eventName' | 'opacities'>;

export const useAnimated = (options: UseAnimatedOptions) => {
    const {eventName = 'none', opacities = [0, 0.08, 0.12]} = options;
    const [opacityAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const opacity = opacityAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: opacities,
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
        const event = {
            blur: 0,
            focus: 2,
            hoverIn: 1,
            hoverOut: 0,
            longPress: 2,
            none: 0,
            press: 1,
            pressIn: 2,
            pressOut: 1,
        } as Record<EventName, number>;

        processAnimatedTiming(opacityAnimated, event[eventName] ?? 0);
    }, [opacities, opacityAnimated, processAnimatedTiming, eventName]);

    return {opacity};
};
