import {Theme, TransitionOptions} from '@bearei/theme';
import {Animated, Easing, Platform} from 'react-native';

export interface AnimatedTimingProps extends TransitionOptions {
    toValue: number;
}

export const animatedTiming =
    (theme: Theme) =>
    (animation: Animated.Value, {duration, easing, toValue}: AnimatedTimingProps) => {
        const {bezier, duration: transitionDuration} = theme.transition({duration, easing});

        return Animated.timing(animation, {
            duration: transitionDuration,
            easing: Easing.bezier(bezier.x0, bezier.y0, bezier.x1, bezier.y1),
            toValue,
            useNativeDriver: Platform.OS !== 'web',
        });
    };
