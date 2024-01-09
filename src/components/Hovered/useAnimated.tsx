import {useEffect, useMemo} from 'react';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {EventName} from '../Common/interface';
import {RenderProps} from './HoveredBase';

export type UseAnimatedOptions = Pick<RenderProps, 'eventName' | 'opacities'>;

export const useAnimated = (options: UseAnimatedOptions) => {
    const {eventName = 'none', opacities = [0, 0.08, 0.12]} = options;
    const [opacityAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const event = useMemo(
        () =>
            ({
                blur: 0,
                focus: 2,
                hoverIn: 1,
                hoverOut: 0,
                longPress: 2,
                none: 0,
                press: 1,
                pressIn: 2,
                pressOut: 1,
            } as Record<EventName, number>),
        [],
    );

    const opacity = opacityAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: opacities,
    });

    useEffect(() => {
        requestAnimationFrame(() => {
            animatedTiming(opacityAnimated, {
                toValue: event[eventName] ?? 0,
            }).start();
        });
    }, [animatedTiming, event, eventName, opacityAnimated]);

    return {opacity};
};
