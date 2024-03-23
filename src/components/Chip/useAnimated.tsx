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
import {RenderProps} from './ChipBase';

type UseAnimatedOptions = Pick<RenderProps, 'disabled' | 'type' | 'eventName' | 'elevated'>;
interface ProcessOutlinedAnimatedOptions extends UseAnimatedOptions {
    border: SharedValue<AnimatableValue>;
    borderInputRange: number[];
}

interface ProcessAnimatedTimingOptions extends ProcessOutlinedAnimatedOptions {
    color: SharedValue<AnimatableValue>;
}

const processOutlinedAnimated = (
    animatedTiming: AnimatedTiming,
    {border, borderInputRange, disabled, eventName}: ProcessOutlinedAnimatedOptions,
) => {
    const value = disabled ? 0 : borderInputRange[borderInputRange.length - 2];
    const toValue = eventName === 'focus' ? borderInputRange[2] : value;

    return animatedTiming(border, {toValue});
};

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {border, borderInputRange, color, disabled, elevated, eventName}: ProcessAnimatedTimingOptions,
) => {
    const toValue = disabled ? 0 : 1;

    if (!elevated) {
        processOutlinedAnimated(animatedTiming, {
            border,
            borderInputRange,
            disabled,
            eventName,
        });

        animatedTiming(color, {toValue});

        return;
    }

    animatedTiming(color, {toValue});
};

export const useAnimated = ({
    disabled,
    type = 'filter',
    eventName,
    elevated,
}: UseAnimatedOptions) => {
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
        input: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.color.convertHexToRGBA(theme.palette.surface.surfaceContainerLow, 0),
            ],
        },
        assist: {
            inputRange: [0, 1],
            outputRange: [
                elevated
                    ? disabledBackgroundColor
                    : theme.color.convertHexToRGBA(theme.palette.surface.surfaceContainerLow, 0),
                elevated
                    ? theme.color.convertHexToRGBA(theme.palette.surface.surfaceContainerLow, 1)
                    : theme.color.convertHexToRGBA(theme.palette.surface.surfaceContainerLow, 0),
            ],
        },
        filter: {
            inputRange: [0, 1],
            outputRange: [
                elevated
                    ? disabledBackgroundColor
                    : theme.color.convertHexToRGBA(theme.palette.surface.surfaceContainerLow, 0),
                elevated
                    ? theme.color.convertHexToRGBA(theme.palette.surface.surfaceContainerLow, 1)
                    : theme.color.convertHexToRGBA(theme.palette.surface.surfaceContainerLow, 0),
            ],
        },
        suggestion: {
            inputRange: [0, 1],
            outputRange: [
                elevated
                    ? disabledBackgroundColor
                    : theme.color.convertHexToRGBA(theme.palette.surface.surfaceContainerLow, 0),
                elevated
                    ? theme.color.convertHexToRGBA(theme.palette.surface.surfaceContainerLow, 1)
                    : theme.color.convertHexToRGBA(theme.palette.surface.surfaceContainerLow, 0),
            ],
        },
        // text: {
        //     inputRange: [0, 1],
        //     outputRange: [
        //         elevated
        //             ? disabledBackgroundColor
        //             : theme.color.convertHexToRGBA(theme.palette.surface.surfaceContainerLow, 0),
        //         elevated
        //             ? theme.color.convertHexToRGBA(theme.palette.surface.surfaceContainerLow, 1)
        //             : theme.color.convertHexToRGBA(theme.palette.surface.surfaceContainerLow, 0),
        //     ],
        // },
    };

    const colorType = {
        input: {
            inputRange: [0, 1, 2],
            outputRange: [
                disabledColor,
                theme.color.convertHexToRGBA(theme.palette.surface.onSurfaceVariant, 1),
                theme.color.convertHexToRGBA(theme.palette.secondary.onSecondaryContainer, 1),
            ],
        },
        assist: {
            inputRange: [0, 1, 2],
            outputRange: [
                disabledColor,
                theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 1),
                theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 1),
            ],
        },
        filter: {
            inputRange: [0, 1, 2],
            outputRange: [
                disabledColor,
                theme.color.convertHexToRGBA(theme.palette.surface.onSurfaceVariant, 1),
                theme.color.convertHexToRGBA(theme.palette.secondary.onSecondaryContainer, 1),
            ],
        },
        suggestion: {
            inputRange: [0, 1, 2],
            outputRange: [
                disabledColor,
                theme.color.convertHexToRGBA(theme.palette.surface.onSurfaceVariant, 1),
                theme.color.convertHexToRGBA(theme.palette.secondary.onSecondaryContainer, 1),
            ],
        },
        // text: {
        //     inputRange: [0, 1, 2],
        //     outputRange: [
        //         disabledColor,
        //         theme.color.convertHexToRGBA(theme.palette.surface.onSurfaceVariant, 1),
        //         theme.color.convertHexToRGBA(theme.palette.secondary.onSecondaryContainer, 1),
        //     ],
        // },
    };

    const contentAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            color.value,
            backgroundColorType[type].inputRange,
            backgroundColorType[type].outputRange,
        ),

        ...(!elevated && {
            borderColor: interpolateColor(border.value, borderInputRange, [
                disabledBackgroundColor,
                theme.color.convertHexToRGBA(theme.palette.outline.outline, 1),
                theme.color.convertHexToRGBA(theme.palette.surface.surface, 1),
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
            elevated,
            eventName,
        });

        return () => {
            cancelAnimation(border);
            cancelAnimation(color);
        };
    }, [animatedTiming, border, borderInputRange, color, disabled, elevated, eventName]);

    return [
        {
            contentAnimatedStyle,
            labelTextAnimatedStyle,
        },
    ];
};
