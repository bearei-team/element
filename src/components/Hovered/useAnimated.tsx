import {useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {HOOK} from '../../hooks/hook';
import {AnimatedTiming} from '../../utils/animatedTiming.utils';
import {UTIL} from '../../utils/util';
import {EventName} from '../Common/interface';
import {RenderProps} from './HoveredBase';

export type UseAnimatedOptions = Pick<RenderProps, 'eventName' | 'opacities'>;

export interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    opacityAnimated: Animated.Value;
    event: Record<EventName, number>;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {opacityAnimated, eventName = 'none', event}: ProcessAnimatedTimingOptions,
) =>
    requestAnimationFrame(() =>
        animatedTiming(opacityAnimated, {
            toValue: event[eventName] ?? 0,
        }).start(),
    );

export const useAnimated = ({
    eventName = 'none',
    opacities = [0, 0.08, 0.12],
}: UseAnimatedOptions) => {
    const [opacityAnimated] = HOOK.useAnimatedValue(0);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const activeValue = opacities.length === 3 ? opacities.length - 1 : 0;
    const event = useMemo(
        () =>
            ({
                blur: 0,
                focus: activeValue,
                hoverIn: 1,
                hoverOut: 0,
                longPress: activeValue,
                none: 0,
                press: 1,
                pressIn: activeValue,
                pressOut: 1,
            } as Record<EventName, number>),
        [activeValue],
    );

    const opacity = opacityAnimated.interpolate({
        inputRange: Array.from({length: opacities.length}, (_, index) => index),
        outputRange: opacities,
    });

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {event, eventName, opacityAnimated});
    }, [animatedTiming, event, eventName, opacityAnimated]);

    return [{opacity}];
};
