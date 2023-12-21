import {Theme, TransitionOptions} from '@bearei/theme';
import {Animated, Easing} from 'react-native';

export interface AnimatedTimingOptions extends TransitionOptions {
    toValue: number;
}

export const animatedTiming =
    (theme: Theme) =>
    (animation: Animated.Value, options: AnimatedTimingOptions) => {
        const {duration, easing, toValue} = options;
        const {bezier, duration: transitionDuration} = theme.transition({
            duration,
            easing,
        });

        return Animated.timing(animation, {
            duration: transitionDuration,
            easing: Easing.bezier(bezier.x0, bezier.y0, bezier.x1, bezier.y1),
            toValue,

            /**
             * TODO: Native animation optimization
             *
             * Currently, many animation features are only supported at runtime in JavaScript.
             * The decision to iterate towards native animation features will be evaluated based
             * on the performance requirements of the actual released products.
             * Support for this is not currently under consideration.
             */
            useNativeDriver: false,
        });
    };
