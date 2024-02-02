import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {HOOK} from '../../hooks/hook';
import {AnimatedTiming, AnimatedTimingOptions} from '../../utils/animatedTiming.utils';
import {UTIL} from '../../utils/util';
import {RenderProps} from './SideSheetBase';

export interface UseAnimatedOptions extends Pick<RenderProps, 'visible' | 'position'> {
    finished: () => void;
}

export interface ScreenAnimatedOptions {
    containerAnimated: Animated.Value;
    finished?: () => void;
    innerAnimated: Animated.Value;
}

export interface ProcessAnimatedTimingOptions extends ScreenAnimatedOptions {
    visible?: boolean;
}

const enterScreen = (
    animatedTiming: AnimatedTiming,
    {containerAnimated, innerAnimated}: ScreenAnimatedOptions,
) => {
    const animatedTimingOptions = {
        duration: 'medium3',
        easing: 'emphasizedDecelerate',
        toValue: 1,
    } as AnimatedTimingOptions;

    requestAnimationFrame(() =>
        Animated.parallel([
            animatedTiming(containerAnimated, animatedTimingOptions),
            animatedTiming(innerAnimated, animatedTimingOptions),
        ]).start(),
    );
};

const exitScreen = (
    animatedTiming: AnimatedTiming,
    {containerAnimated, innerAnimated, finished}: ScreenAnimatedOptions,
) => {
    const animatedTimingOptions = {
        duration: 'short3',
        easing: 'emphasizedAccelerate',
        toValue: 0,
    } as AnimatedTimingOptions;

    requestAnimationFrame(() =>
        Animated.parallel([
            animatedTiming(containerAnimated, animatedTimingOptions),
            animatedTiming(innerAnimated, animatedTimingOptions),
        ]).start(finished),
    );
};

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {visible, containerAnimated, innerAnimated, finished}: ProcessAnimatedTimingOptions,
) => {
    if (typeof visible !== 'boolean') {
        return;
    }

    const screenAnimatedOptions = {containerAnimated, innerAnimated};

    visible
        ? enterScreen(animatedTiming, screenAnimatedOptions)
        : exitScreen(animatedTiming, {...screenAnimatedOptions, finished});
};

export const useAnimated = ({visible, finished, position}: UseAnimatedOptions) => {
    const [containerAnimated] = HOOK.useAnimatedValue(0);
    const [innerAnimated] = HOOK.useAnimatedValue(0);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const backgroundColor = containerAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.color.rgba(theme.palette.scrim.scrim, 0),
            theme.color.rgba(theme.palette.scrim.scrim, 0.32),
        ],
    });

    const innerTranslateX = innerAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            position === 'horizontalEnd'
                ? theme.adaptSize(theme.spacing.small * 40)
                : -theme.adaptSize(theme.spacing.small * 40),
            theme.adaptSize(theme.spacing.none),
        ],
    });

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {
            containerAnimated,
            finished,
            innerAnimated,
            visible,
        });
    }, [animatedTiming, containerAnimated, finished, innerAnimated, visible]);

    return [{backgroundColor, innerTranslateX}];
};
