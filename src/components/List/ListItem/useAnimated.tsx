import {useCallback, useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../../utils/animatedTiming.utils';
import {EventName, State} from '../../Common/interface';
import {RenderProps} from './ListItemBase';

interface UseAnimatedOptions extends Pick<RenderProps, 'trailingButton' | 'gap' | 'closeIcon'> {
    eventName: EventName;
    layoutHeight?: number;
    state: State;
    trailingEventName: EventName;
}

interface ProcessCloseAnimatedOptions {
    finished?: () => void;
    heightAnimated: Animated.Value;
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
        eventName = 'none',
        state,
        trailingButton,
        trailingEventName,
        trailingOpacityAnimated,
        closeIcon,
    }: ProcessAnimatedTimingOptions,
) => {
    const toValue = state !== 'enabled' ? 1 : 0;

    [trailingButton, closeIcon].includes(true) &&
        animatedTiming(trailingOpacityAnimated, {
            toValue: [eventName, trailingEventName].includes('hoverIn') ? 1 : toValue,
        }).start();
};

export const useAnimated = ({
    closeIcon,
    eventName,
    gap = 0,
    layoutHeight = 0,
    state,
    trailingButton,
    trailingEventName,
}: UseAnimatedOptions) => {
    const [heightAnimated] = useAnimatedValue(1);
    const [trailingOpacityAnimated] = useAnimatedValue(trailingButton ? 0 : 1);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);
    const trailingOpacity = trailingOpacityAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const height = useMemo(
        () =>
            heightAnimated.interpolate({
                inputRange: [0, 1],
                outputRange: [0, layoutHeight + gap],
            }),
        [gap, heightAnimated, layoutHeight],
    );

    const onCloseAnimated = useCallback(
        (finished?: () => void) => processCloseAnimated(animatedTiming, {heightAnimated, finished}),
        [animatedTiming, heightAnimated],
    );

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {
            closeIcon,
            eventName,
            state,
            trailingButton,
            trailingEventName,
            trailingOpacityAnimated,
        });

        return () => {
            heightAnimated.stopAnimation();
            trailingOpacityAnimated.stopAnimation();
        };
    }, [
        animatedTiming,
        closeIcon,
        eventName,
        heightAnimated,
        state,
        trailingButton,
        trailingEventName,
        trailingOpacityAnimated,
    ]);

    return [{height, onCloseAnimated, trailingOpacity}];
};
