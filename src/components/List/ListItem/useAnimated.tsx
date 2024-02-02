import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {HOOK} from '../../../hooks/hook';
import {AnimatedTiming} from '../../../utils/animatedTiming.utils';
import {UTIL} from '../../../utils/util';
import {EventName, State} from '../../Common/interface';
import {RenderProps} from './ListItemBase';

export interface UseAnimatedOptions extends Pick<RenderProps, 'close'> {
    eventName: EventName;
    layoutHeight?: number;
    state: State;
    trailingEventName: EventName;
}

export interface ProcessCloseAnimatedOptions {
    heightAnimated: Animated.Value;
}

const processCloseAnimated = (
    animatedTiming: AnimatedTiming,
    {heightAnimated}: ProcessCloseAnimatedOptions,
) => requestAnimationFrame(() => animatedTiming(heightAnimated, {toValue: 0}).start());

export interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    trailingOpacityAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {
        trailingOpacityAnimated,
        eventName = 'none',
        trailingEventName,
        close,
        state,
    }: ProcessAnimatedTimingOptions,
) => {
    const closeIconValue = state !== 'enabled' ? 1 : 0;
    const closeIconToValue = [eventName, trailingEventName].includes('hoverIn')
        ? 1
        : closeIconValue;

    requestAnimationFrame(() =>
        animatedTiming(trailingOpacityAnimated, {
            toValue: close ? closeIconToValue : 1,
        }).start(),
    );
};

export const useAnimated = ({
    close,
    eventName,
    layoutHeight = 0,
    state,
    trailingEventName,
}: UseAnimatedOptions) => {
    const [heightAnimated] = HOOK.useAnimatedValue(1);
    const [trailingOpacityAnimated] = HOOK.useAnimatedValue(close ? 0 : 1);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const trailingOpacity = trailingOpacityAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const height = heightAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, layoutHeight],
    });

    const onCloseAnimated = useCallback(
        () => processCloseAnimated(animatedTiming, {heightAnimated}),
        [animatedTiming, heightAnimated],
    );

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {
            close,
            eventName,
            state,
            trailingEventName,
            trailingOpacityAnimated,
        });
    }, [animatedTiming, close, eventName, state, trailingEventName, trailingOpacityAnimated]);

    return [{height, onCloseAnimated, trailingOpacity}];
};
