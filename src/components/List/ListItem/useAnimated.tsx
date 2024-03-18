import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../../utils/animatedTiming.utils';
import {EventName, State} from '../../Common/interface';
import {RenderProps} from './ListItemBase';

interface UseAnimatedOptions extends Pick<RenderProps, 'trailingControl' | 'gap'> {
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
) => animatedTiming(heightAnimated, {toValue: 0}).start(finished);

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {
        trailingControl,
        eventName = 'none',
        state,
        trailingEventName,
        trailingOpacityAnimated,
    }: ProcessAnimatedTimingOptions,
) => {
    const toValue = state !== 'enabled' ? 1 : 0;

    trailingControl &&
        animatedTiming(trailingOpacityAnimated, {
            toValue: [eventName, trailingEventName].includes('hoverIn') ? 1 : toValue,
        }).start();
};

export const useAnimated = ({
    eventName,
    layoutHeight = 0,
    gap = 0,
    state,
    trailingEventName,
    trailingControl,
}: UseAnimatedOptions) => {
    const [heightAnimated] = useAnimatedValue(1);
    const [trailingOpacityAnimated] = useAnimatedValue(trailingControl ? 0 : 1);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);
    const trailingOpacity = trailingOpacityAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const height = heightAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, layoutHeight + gap],
    });

    const onCloseAnimated = useCallback(
        (finished?: () => void) => processCloseAnimated(animatedTiming, {heightAnimated, finished}),
        [animatedTiming, heightAnimated],
    );

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {
            eventName,
            state,
            trailingControl,
            trailingEventName,
            trailingOpacityAnimated,
        });

        return () => {
            trailingOpacityAnimated.stopAnimation();
            heightAnimated.stopAnimation();
        };
    }, [
        animatedTiming,
        eventName,
        heightAnimated,
        state,
        trailingControl,
        trailingEventName,
        trailingOpacityAnimated,
    ]);

    return [{height, onCloseAnimated, trailingOpacity}];
};
