import {CreateTransitionOptions, Theme} from '@bearei/theme';
import {useCallback} from 'react';
import {Animated, Easing} from 'react-native';

export interface AnimatedTimingOptions
    extends Partial<
        Omit<Animated.TimingAnimationConfig, 'easing' | 'duration'> & CreateTransitionOptions
    > {
    toValue: number;
}
export type AnimatedTiming = (
    animation: Animated.Value,
    options: AnimatedTimingOptions,
) => Animated.CompositeAnimation;

export const useAnimatedTiming = (theme: Theme) => {
    const animatedTiming = useCallback(
        (
            animation: Animated.Value,
            {
                duration = 'short3',
                easing = 'standard',
                toValue,
                useNativeDriver = false,
                ...animatedConfig
            }: AnimatedTimingOptions,
        ) => {
            animation.stopAnimation();

            const {bezier, duration: transitionDuration} = theme.createTransition({
                duration,
                easing,
            });

            return Animated.timing(animation, {
                ...animatedConfig,
                duration: transitionDuration,
                easing: Easing.bezier(bezier.x0, bezier.y0, bezier.x1, bezier.y1),
                toValue,
                useNativeDriver,
            });
        },
        [theme],
    );

    return [animatedTiming];
};
