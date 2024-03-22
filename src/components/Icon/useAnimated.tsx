import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {AnimatedTiming, useAnimatedTiming} from '../../hooks/useAnimatedTiming';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {RenderProps} from './IconBase';

type UseAnimatedOptions = Pick<RenderProps, 'eventName'>;
interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    scaleAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {scaleAnimated, eventName = 'none'}: ProcessAnimatedTimingOptions,
) => {
    const toValue = ['pressIn', 'longPress'].includes(eventName) ? 0 : 1;

    animatedTiming(scaleAnimated, {
        toValue: eventName === 'hoverIn' ? 2 : toValue,
    }).start();
};

export const useAnimated = ({eventName}: UseAnimatedOptions) => {
    const [scaleAnimated] = useAnimatedValue(1);
    const theme = useTheme();
    const [animatedTiming] = useAnimatedTiming(theme);
    const scale = scaleAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0.97, 1, 1.03],
    });

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {eventName, scaleAnimated});

        return () => {
            scaleAnimated.stopAnimation();
        };
    }, [animatedTiming, eventName, scaleAnimated]);

    return [{scale}];
};
