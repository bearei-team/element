import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../../utils/animatedTiming.utils';
import {EventName, State} from '../../Common/interface';
import {RenderProps} from './ListItemBase';

interface UseAnimatedOptions extends Pick<RenderProps, 'close'> {
    eventName: EventName;
    layoutHeight?: number;
    state: State;
    trailingEventName: EventName;
}

interface ProcessCloseAnimatedOptions {
    heightAnimated: Animated.Value;
    finished?: () => void;
}

interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    trailingOpacityAnimated: Animated.Value;
}

const processCloseAnimated = (
    animatedTiming: AnimatedTiming,
    {heightAnimated, finished}: ProcessCloseAnimatedOptions,
) => requestAnimationFrame(() => animatedTiming(heightAnimated, {toValue: 0}).start(finished));

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {
        close,
        eventName = 'none',
        state,
        trailingEventName,
        trailingOpacityAnimated,
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
    const [heightAnimated] = useAnimatedValue(1);
    const [trailingOpacityAnimated] = useAnimatedValue(close ? 0 : 1);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);
    const trailingOpacity = trailingOpacityAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const height = heightAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, layoutHeight],
    });

    const onCloseAnimated = useCallback(
        (finished?: () => void) => processCloseAnimated(animatedTiming, {heightAnimated, finished}),
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
