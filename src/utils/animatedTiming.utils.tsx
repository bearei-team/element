import {Theme, TransitionOptions} from '@bearei/theme';
import {Animated, Easing} from 'react-native';

export interface AnimatedTimingProps extends TransitionOptions {
    toValue: number;
}

export const animatedTiming =
    (theme: Theme) =>
    (
        animation: Animated.Value,
        {toValue, duration, easing}: AnimatedTimingProps,
    ): Animated.CompositeAnimation => {
        const {duration: transitionDuration, bezier} = theme.transition({duration, easing});

        return Animated.timing(animation, {
            toValue,
            easing: Easing.bezier(bezier.x0, bezier.y0, bezier.x1, bezier.y1),
            duration: transitionDuration,
            useNativeDriver: true,
        });
    };
