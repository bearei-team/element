import {useCallback, useEffect} from 'react';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {UTIL} from '../../../utils/util';
import {RenderProps} from './RippleBase';

export interface UseAnimatedOptions
    extends Pick<
        RenderProps,
        'onEntryAnimatedEnd' | 'sequence' | 'active' | 'defaultActive'
    > {
    minDuration: number;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {
        active,
        defaultActive,
        minDuration,
        onEntryAnimatedEnd,
        sequence = 'undefined',
    } = options;

    const [opacityAnimated] = useAnimatedValue(1);
    const [scaleAnimated] = useAnimatedValue(defaultActive ? 1 : 0);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const useNativeDriver = true;
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
                    useNativeDriver,
                }).start(finished),
            );
        },
        [animatedTiming, minDuration, scaleAnimated, useNativeDriver],
    );

    const exitAnimated = useCallback(
        (finished?: () => void) => {
            requestAnimationFrame(() => {
                activeRipple &&
                    animatedTiming(scaleAnimated, {
                        duration: 'short3',
                        easing: 'emphasizedAccelerate',
                        toValue: 0,
                        useNativeDriver,
                    }).start();

                animatedTiming(opacityAnimated, {
                    duration: 'short3',
                    easing: 'emphasizedAccelerate',
                    toValue: 0,
                    useNativeDriver,
                }).start(finished);
            });
        },
        [
            activeRipple,
            animatedTiming,
            opacityAnimated,
            scaleAnimated,
            useNativeDriver,
        ],
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

    return {opacity, scale};
};
