import {CreateTransitionOptions, Theme} from '@bearei/theme';
import {useCallback} from 'react';
import {
    AnimatableValue,
    AnimationCallback,
    Easing,
    SharedValue,
    WithTimingConfig,
    cancelAnimation,
    withTiming,
} from 'react-native-reanimated';

export interface AnimatedTimingOptions
    extends Partial<CreateTransitionOptions & Omit<WithTimingConfig, 'duration' | 'easing'>> {
    toValue: number;
}

export interface AnimatedTiming {
    (
        sharedValue: SharedValue<AnimatableValue>,
        options: AnimatedTimingOptions,
        callback?: AnimationCallback,
    ): void;
}

export const useAnimatedTiming = (theme: Theme) => {
    const animatedTiming = useCallback(
        (
            sharedValue: SharedValue<AnimatableValue>,
            {duration = 'short3', easing = 'standard', toValue, ...config}: AnimatedTimingOptions,
            callback?: AnimationCallback,
        ) => {
            cancelAnimation(sharedValue);

            const {bezier, duration: transitionDuration} = theme.createTransition({
                duration,
                easing,
            });

            sharedValue.value = withTiming(
                toValue,
                {
                    duration: transitionDuration,
                    easing: Easing.bezier(bezier.x0, bezier.y0, bezier.x1, bezier.y1),
                    ...config,
                },
                callback,
            );
        },
        [theme],
    );

    return [animatedTiming];
};
