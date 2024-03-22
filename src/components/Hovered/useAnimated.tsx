import {useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {AnimatedTiming, useAnimatedTiming} from '../../hooks/useAnimatedTiming';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {EventName} from '../Common/interface';
import {RenderProps} from './HoveredBase';

type UseAnimatedOptions = Pick<RenderProps, 'eventName' | 'opacities'>;
interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    opacityAnimated: Animated.Value;
    event: Record<EventName, number>;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {opacityAnimated, eventName = 'none', event}: ProcessAnimatedTimingOptions,
) =>
    animatedTiming(opacityAnimated, {
        toValue: event[eventName] ?? 0,
    }).start();

export const useAnimated = ({eventName, opacities = [0, 0.08, 0.12]}: UseAnimatedOptions) => {
    const [opacityAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const [animatedTiming] = useAnimatedTiming(theme);
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

        return () => {
            opacityAnimated.stopAnimation();
        };
    }, [animatedTiming, event, eventName, opacityAnimated]);

    return [{opacity}];
};
