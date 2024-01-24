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
    animatedTiming: AnimatedTiming;
    containerAnimated: Animated.Value;
    finished?: () => void;
    innerAnimated: Animated.Value;
}

const enterScreen = ({containerAnimated, innerAnimated, animatedTiming}: ScreenAnimatedOptions) => {
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

const exitScreen = ({
    containerAnimated,
    innerAnimated,
    animatedTiming,
    finished,
}: ScreenAnimatedOptions) => {
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
        if (typeof visible === 'boolean') {
            const screenAnimatedOptions = {containerAnimated, innerAnimated, animatedTiming};

            visible
                ? enterScreen(screenAnimatedOptions)
                : exitScreen({...screenAnimatedOptions, finished});
        }
    }, [animatedTiming, containerAnimated, finished, innerAnimated, visible]);

    return [{backgroundColor, innerTranslateX}];
};
