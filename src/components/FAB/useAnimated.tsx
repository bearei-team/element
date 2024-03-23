import {useEffect} from 'react';
import {
    AnimatableValue,
    SharedValue,
    cancelAnimation,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import {useTheme} from 'styled-components/native';
import {AnimatedTiming, useAnimatedTiming} from '../../hooks/useAnimatedTiming';
import {RenderProps} from './FABBase';

type UseAnimatedOptions = Pick<RenderProps, 'disabled' | 'type'>;
interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    color: SharedValue<AnimatableValue>;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {color, disabled}: ProcessAnimatedTimingOptions,
) => typeof disabled === 'boolean' && animatedTiming(color, {toValue: disabled ? 0 : 1});

export const useAnimated = ({disabled, type = 'primary'}: UseAnimatedOptions) => {
    const color = useSharedValue(disabled ? 0 : 1);
    const theme = useTheme();
    const [animatedTiming] = useAnimatedTiming(theme);
    const disabledBackgroundColor = theme.color.convertHexToRGBA(
        theme.palette.surface.onSurface,
        0.12,
    );

    const disabledColor = theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 0.38);
    const backgroundColorType = {
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

    const colorType = {
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

    const contentAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            color.value,
            backgroundColorType[type].inputRange,
            backgroundColorType[type].outputRange,
        ),
    }));

    const labelTextAnimatedStyle = useAnimatedStyle(() => ({
        color: interpolateColor(
            color.value,
            colorType[type].inputRange,
            colorType[type].outputRange,
        ),
    }));

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {color, disabled});

        return () => {
            cancelAnimation(color);
        };
    }, [animatedTiming, color, disabled]);

    return [{contentAnimatedStyle, labelTextAnimatedStyle}];
};
