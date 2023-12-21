import {useCallback, useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {AnimatedTimingOptions} from '../../utils/animatedTiming.utils';
import {UTIL} from '../../utils/util';
import {RenderProps} from './SheetBase';

export interface ProcessAnimatedTimingOptions
    extends Pick<AnimatedTimingOptions, 'duration' | 'easing'> {
    finished?: () => void;
    toValue: number;
}

export interface UseAnimatedOptions
    extends Required<Pick<RenderProps, 'visible' | 'position'>> {
    finished: () => void;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {visible, finished, position} = options;
    const [containerAnimated] = useAnimatedValue(0);
    const [innerAnimated] = useAnimatedValue(0);
    const theme = useTheme();
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

    const processAnimatedTiming = useCallback(
        (
            animation: Animated.Value,
            processAnimatedTimingOptions: ProcessAnimatedTimingOptions,
        ) => {
            const {
                duration = 'short3',
                easing = 'standard',
                finished: animatedFinished,
                toValue,
            } = processAnimatedTimingOptions;

            const animatedTiming = UTIL.animatedTiming(theme);

            requestAnimationFrame(() =>
                animatedTiming(animation, {
                    duration,
                    easing,
                    toValue,
                }).start(animatedFinished),
            );
        },
        [theme],
    );

    useEffect(() => {
        const enterScreen = () => {
            const animatedTimingOptions = {
                duration: 'medium3',
                easing: 'emphasizedDecelerate',
                toValue: 1,
            } as ProcessAnimatedTimingOptions;

            processAnimatedTiming(containerAnimated, animatedTimingOptions);
            processAnimatedTiming(innerAnimated, animatedTimingOptions);
        };

        const exitScreen = () => {
            const animatedTimingOptions = {
                duration: 'short3',
                easing: 'emphasizedAccelerate',
                toValue: 0,
            } as ProcessAnimatedTimingOptions;

            processAnimatedTiming(containerAnimated, animatedTimingOptions);
            processAnimatedTiming(innerAnimated, {
                ...animatedTimingOptions,
                finished,
            });
        };

        visible ? enterScreen() : exitScreen();
    }, [
        containerAnimated,
        finished,
        innerAnimated,
        processAnimatedTiming,
        visible,
    ]);

    return {backgroundColor, innerTranslateX};
};
