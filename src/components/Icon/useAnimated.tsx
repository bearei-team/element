import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../utils/animatedTiming.utils';
import {RenderProps} from './IconBase';

export type UseAnimatedOptions = Pick<RenderProps, 'eventName'>;

export interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    scaleAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {scaleAnimated, eventName = 'none'}: ProcessAnimatedTimingOptions,
) => {
    const toValue = ['pressIn', 'longPress'].includes(eventName) ? 0 : 1;

    requestAnimationFrame(() =>
        animatedTiming(scaleAnimated, {
            toValue: eventName === 'hoverIn' ? 2 : toValue,
        }).start(),
    );
};

export const useAnimated = ({eventName}: UseAnimatedOptions) => {
    const [scaleAnimated] = useAnimatedValue(1);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);
    const scale = scaleAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0.97, 1, 1.03],
    });

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {eventName, scaleAnimated});
    }, [animatedTiming, eventName, scaleAnimated]);

    return [{scale}];
};
