import {useEffect, useMemo} from 'react';
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
import {RenderProps} from './ButtonBase';

type UseAnimatedOptions = Pick<RenderProps, 'disabled' | 'type' | 'eventName'>;
interface ProcessOutlinedAnimatedOptions extends UseAnimatedOptions {
    border: SharedValue<AnimatableValue>;
    borderInputRange: number[];
}

interface ProcessAnimatedTimingOptions extends ProcessOutlinedAnimatedOptions {
    color: SharedValue<AnimatableValue>;
}

const processOutlinedAnimated = (
    animatedTiming: AnimatedTiming,
    {border, borderInputRange, disabled, eventName, type}: ProcessOutlinedAnimatedOptions,
) => {
    const value = disabled ? 0 : borderInputRange[borderInputRange.length - 2];
    const responseEvent =
        type === 'link'
            ? ['focus', 'hoverIn', 'longPress', 'press', 'pressIn', 'pressOut'].includes(eventName)
            : eventName === 'focus';

    const toValue = responseEvent ? borderInputRange[2] : value;

    return animatedTiming(border, {toValue});
};

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {
        border,
        borderInputRange,
        color,
        disabled,
        eventName,
        type = 'filled',
    }: ProcessAnimatedTimingOptions,
) => {
    const toValue = disabled ? 0 : 1;

    if (['link', 'outlined'].includes(type)) {
        processOutlinedAnimated(animatedTiming, {
            border,
            borderInputRange,
            disabled,
            eventName,
            type,
        });

        animatedTiming(color, {toValue});

        return;
    }

    animatedTiming(color, {toValue});
};

export const useAnimated = ({disabled, type = 'filled', eventName}: UseAnimatedOptions) => {
    const animatedValue = disabled ? 0 : 1;
    const border = useSharedValue(animatedValue);
    const color = useSharedValue(animatedValue);
    const borderInputRange = useMemo(() => [0, 1, 2], []);
    const theme = useTheme();
    const [animatedTiming] = useAnimatedTiming(theme);
    const disabledBackgroundColor = theme.color.convertHexToRGBA(
        theme.palette.surface.onSurface,
        0.12,
    );

    const disabledColor = theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 0.38);
    const backgroundColorType = {
        elevated: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.color.convertHexToRGBA(theme.palette.surface.surfaceContainerLow, 1),
            ],
        },
        filled: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.color.convertHexToRGBA(theme.palette.primary.primary, 1),
            ],
        },
        outlined: {
            inputRange: [0, 1],
            outputRange: [
                theme.color.convertHexToRGBA(theme.palette.primary.primary, 0),
                theme.color.convertHexToRGBA(theme.palette.primary.primary, 0),
            ],
        },
        text: {
            inputRange: [0, 1],
            outputRange: [
                theme.color.convertHexToRGBA(theme.palette.primary.primary, 0),
                theme.color.convertHexToRGBA(theme.palette.primary.primary, 0),
            ],
        },
        link: {
            inputRange: [0, 1],
            outputRange: [
                theme.color.convertHexToRGBA(theme.palette.primary.primary, 0),
                theme.color.convertHexToRGBA(theme.palette.primary.primary, 0),
            ],
        },
        tonal: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.color.convertHexToRGBA(theme.palette.secondary.secondaryContainer, 1),
            ],
        },
    };

    const colorType = {
        elevated: {
            inputRange: [0, 1],
            outputRange: [
                disabledColor,
                theme.color.convertHexToRGBA(theme.palette.primary.primary, 1),
            ],
        },
        filled: {
            inputRange: [0, 1],
            outputRange: [
                disabledColor,
                theme.color.convertHexToRGBA(theme.palette.primary.onPrimary, 1),
            ],
        },
        outlined: {
            inputRange: [0, 1],
            outputRange: [
                disabledColor,
                theme.color.convertHexToRGBA(theme.palette.primary.primary, 1),
            ],
        },
        text: {
            inputRange: [0, 1],
            outputRange: [
                disabledColor,
                theme.color.convertHexToRGBA(theme.palette.primary.primary, 1),
            ],
        },
        link: {
            inputRange: [0, 1],
            outputRange: [
                disabledColor,
                theme.color.convertHexToRGBA(theme.palette.primary.primary, 1),
            ],
        },
        tonal: {
            inputRange: [0, 1],
            outputRange: [
                disabledColor,
                theme.color.convertHexToRGBA(theme.palette.secondary.onSecondaryContainer, 1),
            ],
        },
    };

    const contentAnimatedStyle = useAnimatedStyle(() => ({
        ...(!['text', 'link'].includes(type) && {
            backgroundColor: interpolateColor(
                color.value,
                backgroundColorType[type].inputRange,
                backgroundColorType[type].outputRange,
            ),
        }),

        ...(['outlined', 'link'].includes(type) && {
            borderColor: interpolateColor(border.value, borderInputRange, [
                disabledBackgroundColor,
                type === 'link'
                    ? theme.color.convertHexToRGBA(theme.palette.outline.outline, 0)
                    : theme.color.convertHexToRGBA(theme.palette.outline.outline, 1),
                theme.palette.primary.primary,
            ]),
        }),
    }));

    const labelTextAnimatedStyle = useAnimatedStyle(() => ({
        color: interpolateColor(
            color.value,
            colorType[type].inputRange,
            colorType[type].outputRange,
        ),
    }));

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {
            border,
            borderInputRange,
            color,
            disabled,
            eventName,
            type,
        });

        return () => {
            cancelAnimation(border);
            cancelAnimation(color);
        };
    }, [animatedTiming, border, borderInputRange, color, disabled, eventName, type]);

    return [{contentAnimatedStyle, labelTextAnimatedStyle}];
};
