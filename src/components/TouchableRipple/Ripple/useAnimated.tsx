import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {AnimatedTimingOptions} from '../../../utils/animatedTiming.utils';
import {UTIL} from '../../../utils/util';
import {RenderProps} from './RippleBase';

export interface UseAnimatedOptions
    extends Pick<
        RenderProps,
        'onEntryAnimatedEnd' | 'active' | 'defaultActive'
    > {
    minDuration: number;
    sequence: string;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {active, defaultActive, minDuration, onEntryAnimatedEnd, sequence} =
        options;

    const [opacityAnimated] = useAnimatedValue(1);
    const [scaleAnimated] = useAnimatedValue(defaultActive ? 1 : 0);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const activeRipple = [typeof defaultActive, typeof active].includes(
        'boolean',
    );

    const opacity = opacityAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const scale = scaleAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const entryAnimated = useCallback(
        (finished?: () => void) => {
            requestAnimationFrame(() =>
                animatedTiming(scaleAnimated, {
                    duration: Math.min(minDuration, 400),
                    easing: 'emphasizedDecelerate',
                    toValue: 1,
                }).start(finished),
            );
        },
        [animatedTiming, minDuration, scaleAnimated],
    );

    const exitAnimated = useCallback(
        (finished?: () => void) => {
            const animatedTimingOptions = {
                duration: 'short3',
                easing: 'emphasizedAccelerate',
                toValue: 0,
            } as AnimatedTimingOptions;

            requestAnimationFrame(() => {
                if (activeRipple) {
                    return Animated.parallel([
                        animatedTiming(scaleAnimated, animatedTimingOptions),
                        animatedTiming(opacityAnimated, animatedTimingOptions),
                    ]).start(finished);
                }

                animatedTiming(opacityAnimated, animatedTimingOptions).start(
                    finished,
                );
            });
        },
        [activeRipple, animatedTiming, opacityAnimated, scaleAnimated],
    );

    const processAnimatedTiming = useCallback(() => {
        entryAnimated(() => onEntryAnimatedEnd?.(sequence, exitAnimated));
    }, [entryAnimated, exitAnimated, onEntryAnimatedEnd, sequence]);

    useEffect(() => {
        if (defaultActive) {
            onEntryAnimatedEnd?.(sequence, exitAnimated);
        }
    }, [defaultActive, exitAnimated, onEntryAnimatedEnd, sequence]);

    useEffect(() => {
        const runAnimated = !activeRipple || active;

        if (runAnimated) {
            processAnimatedTiming();
        }
    }, [active, activeRipple, processAnimatedTiming]);

    return [{opacity, scale}];
};
