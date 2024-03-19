import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {AnimatedTiming} from '../../utils/animatedTiming.utils';
import {RenderProps} from './FABBase';

type UseAnimatedOptions = Pick<RenderProps, 'disabled' | 'type'>;
interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    colorAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {colorAnimated, disabled}: ProcessAnimatedTimingOptions,
) =>
    typeof disabled === 'boolean' &&
    animatedTiming(colorAnimated, {toValue: disabled ? 0 : 1}).start();

export const useAnimated = ({disabled, type = 'primary'}: UseAnimatedOptions) => {
    const [colorAnimated] = useAnimatedValue(disabled ? 0 : 1);
    const theme = useTheme();
    const [animatedTiming] = useAnimatedTiming(theme);
    const disabledBackgroundColor = theme.color.convertHexToRGBA(
        theme.palette.surface.onSurface,
        0.12,
    );

    const disabledColor = theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 0.38);
    const backgroundColorConfig = {
        surface: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.color.convertHexToRGBA(theme.palette.surface.surfaceContainerHigh, 1),
            ],
        },
        primary: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.color.convertHexToRGBA(theme.palette.primary.primaryContainer, 1),
            ],
        },
        secondary: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.color.convertHexToRGBA(theme.palette.secondary.secondaryContainer, 1),
            ],
        },
        tertiary: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.color.convertHexToRGBA(theme.palette.tertiary.tertiaryContainer, 1),
            ],
        },
    };

    const colorConfig = {
        surface: {
            inputRange: [0, 1],
            outputRange: [
                disabledColor,
                theme.color.convertHexToRGBA(theme.palette.primary.primary, 1),
            ],
        },
        primary: {
            inputRange: [0, 1],
            outputRange: [
                disabledColor,
                theme.color.convertHexToRGBA(theme.palette.primary.onPrimaryContainer, 1),
            ],
        },
        secondary: {
            inputRange: [0, 1],
            outputRange: [
                disabledColor,
                theme.color.convertHexToRGBA(theme.palette.secondary.onSecondaryContainer, 1),
            ],
        },
        tertiary: {
            inputRange: [0, 1],
            outputRange: [
                disabledColor,
                theme.color.convertHexToRGBA(theme.palette.tertiary.onTertiaryContainer, 1),
            ],
        },
    };

    const backgroundColor = colorAnimated.interpolate(backgroundColorConfig[type]);
    const color = colorAnimated.interpolate(colorConfig[type]);

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {colorAnimated, disabled});

        return () => {
            colorAnimated.stopAnimation();
        };
    }, [animatedTiming, colorAnimated, disabled]);

    return [{backgroundColor, color}];
};
