import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {RenderProps} from './FABBase';

export type UseAnimatedOptions = Required<
    Pick<RenderProps, 'disabled' | 'type'>
>;

export const useAnimated = (options: UseAnimatedOptions) => {
    const {disabled, type} = options;
    const [colorAnimated] = useAnimatedValue(1);
    const theme = useTheme();
    const disabledBackgroundColor = theme.color.rgba(
        theme.palette.surface.onSurface,
        0.12,
    );

    const disabledColor = theme.color.rgba(
        theme.palette.surface.onSurface,
        0.38,
    );

    const backgroundColorConfig = {
        surface: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.palette.surface.surfaceContainerHigh,
            ],
        },
        primary: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.palette.primary.primaryContainer,
            ],
        },
        secondary: {
            inputRange: [0, 1],
            outputRange: [
                theme.color.rgba(theme.palette.primary.primary, 0),
                theme.palette.secondary.secondaryContainer,
            ],
        },
        tertiary: {
            inputRange: [0, 1],
            outputRange: [
                theme.color.rgba(theme.palette.primary.primary, 0),
                theme.palette.tertiary.tertiaryContainer,
            ],
        },
    };

    const colorConfig = {
        surface: {
            inputRange: [0, 1],
            outputRange: [disabledColor, theme.palette.primary.primary],
        },
        primary: {
            inputRange: [0, 1],
            outputRange: [
                disabledColor,
                theme.palette.primary.onPrimaryContainer,
            ],
        },
        secondary: {
            inputRange: [0, 1],
            outputRange: [
                disabledColor,
                theme.palette.secondary.onSecondaryContainer,
            ],
        },
        tertiary: {
            inputRange: [0, 1],
            outputRange: [
                disabledColor,
                theme.palette.tertiary.onTertiaryContainer,
            ],
        },
    };

    const backgroundColor = colorAnimated.interpolate(
        backgroundColorConfig[type],
    );

    const color = colorAnimated.interpolate(colorConfig[type]);

    const processAnimatedTiming = useCallback(
        (animation: Animated.Value, toValue: number) => {
            const animatedTiming = UTIL.animatedTiming(theme);

            requestAnimationFrame(() =>
                animatedTiming(animation, {
                    duration: 'short3',
                    easing: 'standard',
                    toValue,
                    useNativeDriver: true,
                }).start(),
            );
        },
        [theme],
    );

    useEffect(() => {
        processAnimatedTiming(colorAnimated, disabled ? 0 : 1);
    }, [colorAnimated, disabled, processAnimatedTiming]);

    return {
        backgroundColor,
        color,
    };
};
