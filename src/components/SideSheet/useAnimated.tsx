import {useCallback, useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {HOOK} from '../../hooks/hook';
import {AnimatedTimingOptions} from '../../utils/animatedTiming.utils';
import {UTIL} from '../../utils/util';
import {RenderProps} from './SideSheetBase';

export interface UseAnimatedOptions extends Pick<RenderProps, 'visible' | 'position'> {
    finished: () => void;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {visible, finished, position} = options;
    const [containerAnimated] = HOOK.useAnimatedValue(0);
    const [innerAnimated] = HOOK.useAnimatedValue(0);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const backgroundColor = useMemo(
        () =>
            containerAnimated.interpolate({
                inputRange: [0, 1],
                outputRange: [
                    theme.color.rgba(theme.palette.scrim.scrim, 0),
                    theme.color.rgba(theme.palette.scrim.scrim, 0.32),
                ],
            }),
        [containerAnimated, theme.color, theme.palette.scrim.scrim],
    );

    const innerTranslateX = useMemo(
        () =>
            innerAnimated.interpolate({
                inputRange: [0, 1],
                outputRange: [
                    position === 'horizontalEnd'
                        ? theme.adaptSize(theme.spacing.small * 40)
                        : -theme.adaptSize(theme.spacing.small * 40),
                    theme.adaptSize(theme.spacing.none),
                ],
            }),
        [innerAnimated, position, theme],
    );

    const enterScreen = useCallback(() => {
        const animatedTimingOptions = {
            duration: 'medium3',
            easing: 'emphasizedDecelerate',
            toValue: 1,
        } as AnimatedTimingOptions;

        requestAnimationFrame(() => {
            Animated.parallel([
                animatedTiming(containerAnimated, animatedTimingOptions),
                animatedTiming(innerAnimated, animatedTimingOptions),
            ]).start();
        });
    }, [animatedTiming, containerAnimated, innerAnimated]);

    const exitScreen = useCallback(() => {
        const animatedTimingOptions = {
            duration: 'short3',
            easing: 'emphasizedAccelerate',
            toValue: 0,
        } as AnimatedTimingOptions;

        requestAnimationFrame(() => {
            Animated.parallel([
                animatedTiming(containerAnimated, animatedTimingOptions),
                animatedTiming(innerAnimated, animatedTimingOptions),
            ]).start(finished);
        });
    }, [animatedTiming, containerAnimated, finished, innerAnimated]);

    useEffect(() => {
        if (typeof visible === 'boolean') {
            visible ? enterScreen() : exitScreen();
        }
    }, [enterScreen, exitScreen, visible]);

    return [{backgroundColor, innerTranslateX}];
};
