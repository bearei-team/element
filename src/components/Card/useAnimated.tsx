import {useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../utils/animatedTiming.utils';
import {RenderProps} from './CardBase';

export type UseAnimatedOptions = Pick<RenderProps, 'disabled' | 'type' | 'eventName'>;
export interface ProcessOutlinedAnimatedOptions extends UseAnimatedOptions {
    borderAnimated: Animated.Value;
    borderInputRange: number[];
}

export interface ProcessAnimatedTimingOptions extends ProcessOutlinedAnimatedOptions {
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
        eventName,
        type = 'filled',
    }: ProcessAnimatedTimingOptions,
) => {
    const toValue = disabled ? 0 : 1;

    requestAnimationFrame(() => {
        if (type === 'outlined') {
            return Animated.parallel([
                processOutlinedAnimated(animatedTiming, {
                    borderAnimated,
                    borderInputRange,
                    disabled,
                    eventName,
                    type,
                }),
                animatedTiming(colorAnimated, {toValue}),
            ]).start();
        }

        animatedTiming(colorAnimated, {toValue}).start();
    });
};

export const useAnimated = ({disabled, type = 'filled', eventName}: UseAnimatedOptions) => {
    const [borderAnimated] = useAnimatedValue(1);
    const [colorAnimated] = useAnimatedValue(1);
    const borderInputRange = useMemo(() => [0, 1, 2], []);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);
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
                theme.color.convertHexToRGBA(theme.palette.surface.surfaceContainerHighest, 1),
            ],
        },
        outlined: {
            inputRange: [0, 1],
            outputRange: [
                theme.color.convertHexToRGBA(theme.palette.surface.surface, 1),
                theme.color.convertHexToRGBA(theme.palette.surface.surface, 1),
            ],
        },
    };

    const backgroundColor = colorAnimated.interpolate(backgroundColorType[type]);
    const titleColor = colorAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            disabledColor,
            theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 1),
        ],
    });

    const subColor = colorAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            disabledColor,
            theme.color.convertHexToRGBA(theme.palette.surface.onSurfaceVariant, 1),
        ],
    });

    const borderColor = borderAnimated.interpolate({
        inputRange: borderInputRange,
        outputRange: [
            disabledBackgroundColor,
            theme.color.convertHexToRGBA(theme.palette.outline.outlineVariant, 1),
            theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 1),
        ],
    });

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {
            borderAnimated,
            borderInputRange,
            colorAnimated,
            disabled,
            eventName,
            type,
        });
    }, [
        animatedTiming,
        borderAnimated,
        borderInputRange,
        colorAnimated,
        disabled,
        eventName,
        type,
    ]);

    return [
        {
            ...(type === 'outlined' && {borderColor}),
            backgroundColor,
            titleColor,
            subColor,
        },
    ];
};
