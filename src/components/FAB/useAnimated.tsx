import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {HOOK} from '../../hooks/hook';
import {AnimatedTiming} from '../../utils/animatedTiming.utils';
import {UTIL} from '../../utils/util';
import {RenderProps} from './FABBase';

export type UseAnimatedOptions = Pick<RenderProps, 'disabled' | 'type'>;

export interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    colorAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {colorAnimated, disabled}: ProcessAnimatedTimingOptions,
) =>
    typeof disabled === 'boolean' &&
    requestAnimationFrame(() => animatedTiming(colorAnimated, {toValue: disabled ? 0 : 1}).start());

export const useAnimated = ({disabled, type = 'primary'}: UseAnimatedOptions) => {
    const [colorAnimated] = HOOK.useAnimatedValue(1);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const disabledBackgroundColor = theme.color.rgba(theme.palette.surface.onSurface, 0.12);
    const disabledColor = theme.color.rgba(theme.palette.surface.onSurface, 0.38);
    const backgroundColorConfig = {
        surface: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.color.rgba(theme.palette.surface.surfaceContainerHigh, 1),
            ],
        },
        primary: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.color.rgba(theme.palette.primary.primaryContainer, 1),
            ],
        },
        secondary: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.color.rgba(theme.palette.secondary.secondaryContainer, 1),
            ],
        },
        tertiary: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.color.rgba(theme.palette.tertiary.tertiaryContainer, 1),
            ],
        },
    };

    const colorConfig = {
        surface: {
            inputRange: [0, 1],
            outputRange: [disabledColor, theme.color.rgba(theme.palette.primary.primary, 1)],
        },
        primary: {
            inputRange: [0, 1],
            outputRange: [
                disabledColor,
                theme.color.rgba(theme.palette.primary.onPrimaryContainer, 1),
            ],
        },
        secondary: {
            inputRange: [0, 1],
            outputRange: [
                disabledColor,
                theme.color.rgba(theme.palette.secondary.onSecondaryContainer, 1),
            ],
        },
        tertiary: {
            inputRange: [0, 1],
            outputRange: [
                disabledColor,
                theme.color.rgba(theme.palette.tertiary.onTertiaryContainer, 1),
            ],
        },
    };

    const backgroundColor = colorAnimated.interpolate(backgroundColorConfig[type]);
    const color = colorAnimated.interpolate(colorConfig[type]);

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {colorAnimated, disabled});
    }, [animatedTiming, colorAnimated, disabled]);

    return [{backgroundColor, color}];
};
