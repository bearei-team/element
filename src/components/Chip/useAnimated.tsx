import {useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../utils/animatedTiming.utils';
import {RenderProps} from './ChipBase';

type UseAnimatedOptions = Pick<RenderProps, 'disabled' | 'type' | 'eventName' | 'elevated'>;
interface ProcessOutlinedAnimatedOptions extends UseAnimatedOptions {
    borderAnimated: Animated.Value;
    borderInputRange: number[];
}

interface ProcessAnimatedTimingOptions extends ProcessOutlinedAnimatedOptions {
    colorAnimated: Animated.Value;
}

const processOutlinedAnimated = (
    animatedTiming: AnimatedTiming,
    {borderAnimated, borderInputRange, disabled, eventName}: ProcessOutlinedAnimatedOptions,
) => {
    const value = disabled ? 0 : borderInputRange[borderInputRange.length - 2];
    const toValue = eventName === 'focus' ? borderInputRange[2] : value;

    return animatedTiming(borderAnimated, {toValue});
};

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {
        borderAnimated,
        borderInputRange,
        colorAnimated,
        disabled,
        elevated,
        eventName,
    }: ProcessAnimatedTimingOptions,
) => {
    const toValue = disabled ? 0 : 1;

    if (!elevated) {
        return Animated.parallel([
            processOutlinedAnimated(animatedTiming, {
                borderAnimated,
                borderInputRange,
                disabled,
                eventName,
            }),
            animatedTiming(colorAnimated, {toValue}),
        ]).start();
    }

    animatedTiming(colorAnimated, {toValue}).start();
};

export const useAnimated = ({
    disabled,
    type = 'filter',
    eventName,
    elevated,
}: UseAnimatedOptions) => {
    const animatedValue = disabled ? 0 : 1;
    const [borderAnimated] = useAnimatedValue(animatedValue);
    const [colorAnimated] = useAnimatedValue(animatedValue);
    const borderInputRange = useMemo(() => [0, 1, 2], []);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);
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
        text: {
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
        text: {
            inputRange: [0, 1, 2],
            outputRange: [
                disabledColor,
                theme.color.convertHexToRGBA(theme.palette.surface.onSurfaceVariant, 1),
                theme.color.convertHexToRGBA(theme.palette.secondary.onSecondaryContainer, 1),
            ],
        },
    };

    const backgroundColor = colorAnimated.interpolate(backgroundColorType[type]);
    const color = colorAnimated.interpolate(colorType[type]);
    const borderColor = borderAnimated.interpolate({
        inputRange: borderInputRange,
        outputRange: [
            disabledBackgroundColor,
            theme.color.convertHexToRGBA(theme.palette.outline.outline, 1),
            theme.color.convertHexToRGBA(theme.palette.surface.surface, 1),
        ],
    });

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {
            borderAnimated,
            borderInputRange,
            colorAnimated,
            disabled,
            elevated,
            eventName,
        });

        return () => {
            borderAnimated.stopAnimation();
            colorAnimated.stopAnimation();
        };
    }, [
        animatedTiming,
        borderAnimated,
        borderInputRange,
        colorAnimated,
        disabled,
        elevated,
        eventName,
    ]);

    return [
        {
            ...(!elevated && type !== 'text' && {borderColor}),
            backgroundColor,
            color,
        },
    ];
};
