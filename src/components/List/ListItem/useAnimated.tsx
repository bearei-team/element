import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {AnimatedTiming, useAnimatedTiming} from '../../../hooks/useAnimatedTiming';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {EventName, State} from '../../Common/interface';
import {RenderProps} from './ListItemBase';

interface UseAnimatedOptions
    extends Pick<RenderProps, 'trailingButton' | 'itemGap' | 'closeIcon' | 'visible' | 'onClosed'> {
    active?: boolean;
    addonAfterLayoutWidth?: number;
    addonBeforeLayoutWidth?: number;
    eventName: EventName;
    layoutHeight?: number;
    state: State;
    trailingEventName: EventName;
}

interface ProcessVisibleAnimatedOptions extends Pick<UseAnimatedOptions, 'visible' | 'onClosed'> {
    heightAnimated: Animated.Value;
}

interface ProcessAddonAnimatedOptions extends Pick<UseAnimatedOptions, 'active'> {
    addonAfterAnimated: Animated.Value;
    addonBeforeAnimated: Animated.Value;
}

interface ProcessTrailingAnimatedTimingOptions extends UseAnimatedOptions {
    trailingOpacityAnimated: Animated.Value;
}

const processVisibleAnimated = (
    animatedTiming: AnimatedTiming,
    {heightAnimated, onClosed, visible}: ProcessVisibleAnimatedOptions,
) =>
    typeof visible === 'boolean' &&
    animatedTiming(heightAnimated, {toValue: visible ? 1 : 0}).start(
        ({finished}) => finished && !visible && onClosed?.(),
    );

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

const processTrailingAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {
        closeIcon,
        eventName = 'none',
        state,
        trailingButton,
        trailingEventName,
        trailingOpacityAnimated,
    }: ProcessTrailingAnimatedTimingOptions,
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
    itemGap = 0,
    layoutHeight = 0,
    onClosed,
    state,
    trailingButton,
    trailingEventName,
    visible,
}: UseAnimatedOptions) => {
    const [heightAnimated] = useAnimatedValue(typeof visible === 'boolean' ? (visible ? 1 : 0) : 1);
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
        outputRange: [0, layoutHeight + itemGap],
    });

    const addonBeforeWidth = addonBeforeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, addonBeforeLayoutWidth],
    });

    const addonAfterWidth = addonAfterAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, addonAfterLayoutWidth],
    });

    useEffect(() => {
        processTrailingAnimatedTiming(animatedTiming, {
            closeIcon,
            eventName,
            state,
            trailingButton,
            trailingEventName,
            trailingOpacityAnimated,
        });

        return () => {
            trailingOpacityAnimated.stopAnimation();
        };
    }, [
        animatedTiming,
        closeIcon,
        eventName,
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

    useEffect(() => {
        processVisibleAnimated(animatedTiming, {visible, heightAnimated, onClosed});

        return () => {
            heightAnimated.stopAnimation();
        };
    }, [animatedTiming, heightAnimated, onClosed, visible]);

    return [{height, trailingOpacity, addonBeforeWidth, addonAfterWidth}];
};
