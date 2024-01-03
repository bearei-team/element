import {useCallback, useEffect} from 'react';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {UTIL} from '../../../utils/util';
import {RenderProps} from './RippleBase';

export interface UseAnimatedOptions
    extends Pick<RenderProps, 'onEntryAnimatedStart' | 'sequence' | 'active'> {
    minDuration: number;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const [opacityAnimated] = useAnimatedValue(1);
    const [scaleAnimated] = useAnimatedValue(0);
    const {onEntryAnimatedStart, sequence, active} = options;
    const theme = useTheme();
    const opacity = opacityAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const scale = scaleAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const processAnimatedTiming = useCallback(() => {
        const animatedTiming = UTIL.animatedTiming(theme);
        const useNativeDriver = true;

        const exitAnimated = (finished?: () => void) => {
            requestAnimationFrame(() => {
                typeof active === 'boolean' &&
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
        };

        const entryAnimated = (finished?: () => void) => {
            requestAnimationFrame(() =>
                animatedTiming(scaleAnimated, {
                    duration: 'medium3',
                    easing: 'emphasizedDecelerate',
                    toValue: 1,
                    useNativeDriver,
                }).start(finished),
            );
        };

        entryAnimated(() =>
            onEntryAnimatedStart?.(sequence ?? 'undefined', exitAnimated),
        );
    }, [
        active,
        onEntryAnimatedStart,
        opacityAnimated,
        scaleAnimated,
        sequence,
        theme,
    ]);

    useEffect(() => {
        processAnimatedTiming();
    }, [processAnimatedTiming]);

    return {opacity, scale};
};
