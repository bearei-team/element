import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {AnimatedTiming, useAnimatedTiming} from '../../../hooks/useAnimatedTiming';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {EventName, State} from '../../Common/interface';
import {RenderProps} from './ListItemBase';

interface UseAnimatedOptions extends Pick<RenderProps, 'trailingButton' | 'gap' | 'closeIcon'> {
    active?: boolean;
    addonAfterLayoutWidth?: number;
    addonBeforeLayoutWidth?: number;
    eventName: EventName;
    layoutHeight?: number;
    state: State;
    trailingEventName: EventName;
}

interface ProcessCloseAnimatedOptions {
    finished?: () => void;
    heightAnimated: Animated.Value;
}

interface ProcessAddonAnimatedOptions extends Pick<UseAnimatedOptions, 'active'> {
    addonAfterAnimated: Animated.Value;
    addonBeforeAnimated: Animated.Value;
}

interface ProcessContentAnimatedTimingOptions extends UseAnimatedOptions {
    trailingOpacityAnimated: Animated.Value;
}

const processCloseAnimated = (
    animatedTiming: AnimatedTiming,
    {heightAnimated, finished}: ProcessCloseAnimatedOptions,
) => animatedTiming(heightAnimated, {toValue: 0}).start(finished);

const processAddonAnimated = (
    animatedTiming: AnimatedTiming,
    {addonBeforeAnimated, addonAfterAnimated, active}: ProcessAddonAnimatedOptions,
) => {
    const toValue = active ? 1 : 0;

    typeof active === 'boolean' &&
        Animated.parallel([
            animatedTiming(addonBeforeAnimated, {toValue}),
            animatedTiming(addonAfterAnimated, {toValue}),
        ]).start();
};

const processContentAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {
        eventName = 'none',
        state,
        trailingButton,
        trailingEventName,
        trailingOpacityAnimated,
        closeIcon,
    }: ProcessContentAnimatedTimingOptions,
) => {
    const toValue = state !== 'enabled' ? 1 : 0;

    [trailingButton, closeIcon].includes(true) &&
        animatedTiming(trailingOpacityAnimated, {
            toValue: [eventName, trailingEventName].includes('hoverIn') ? 1 : toValue,
        }).start();
};

export const useAnimated = ({
    active,
    addonAfterLayoutWidth = 0,
    addonBeforeLayoutWidth = 0,
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
    const addonDefaultValue = active ? 1 : 0;
    const [addonBeforeAnimated] = useAnimatedValue(addonDefaultValue);
    const [addonAfterAnimated] = useAnimatedValue(addonDefaultValue);
    const theme = useTheme();
    const [animatedTiming] = useAnimatedTiming(theme);
    const trailingOpacity = trailingOpacityAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const height = heightAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, layoutHeight + gap],
    });

    const addonBeforeWidth = addonBeforeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, addonBeforeLayoutWidth],
    });

    const addonAfterWidth = addonAfterAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, addonAfterLayoutWidth],
    });

    const onCloseAnimated = useCallback(
        (finished?: () => void) => processCloseAnimated(animatedTiming, {heightAnimated, finished}),
        [animatedTiming, heightAnimated],
    );

    useEffect(() => {
        processContentAnimatedTiming(animatedTiming, {
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

    useEffect(() => {
        processAddonAnimated(animatedTiming, {
            active,
            addonAfterAnimated,
            addonBeforeAnimated,
        });

        return () => {
            addonBeforeAnimated.stopAnimation();
            addonAfterAnimated.stopAnimation();
        };
    }, [active, addonAfterAnimated, addonBeforeAnimated, animatedTiming]);

    return [{height, onCloseAnimated, trailingOpacity, addonBeforeWidth, addonAfterWidth}];
};
