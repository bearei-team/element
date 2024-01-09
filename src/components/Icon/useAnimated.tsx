import {useEffect} from 'react';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {RenderProps} from './IconBase';

export type UseAnimatedOptions = Pick<RenderProps, 'eventName'>;

export const useAnimated = (options: UseAnimatedOptions) => {
    const {eventName = 'none'} = options;
    const [scaleAnimated] = useAnimatedValue(1);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const scale = scaleAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0.97, 1, 1.03],
    });

    useEffect(() => {
        const toValue = ['pressIn', 'longPress'].includes(eventName) ? 0 : 1;

        requestAnimationFrame(() => {
            animatedTiming(scaleAnimated, {
                toValue: eventName === 'hoverIn' ? 2 : toValue,
            }).start();
        });
    }, [animatedTiming, eventName, scaleAnimated]);

    return [{scale}];
};
