import {useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../utils/animatedTiming.utils';
import {RenderProps} from './ButtonBase';

type UseAnimatedOptions = Pick<RenderProps, 'disabled' | 'type' | 'eventName'>;
interface ProcessOutlinedAnimatedOptions extends UseAnimatedOptions {
    borderAnimated: Animated.Value;
    borderInputRange: number[];
}

interface ProcessAnimatedTimingOptions extends ProcessOutlinedAnimatedOptions {
    colorAnimated: Animated.Value;
}

const processOutlinedAnimated = (
    animatedTiming: AnimatedTiming,
    {borderAnimated, borderInputRange, disabled, eventName, type}: ProcessOutlinedAnimatedOptions,
) => {
    const value = disabled ? 0 : borderInputRange[borderInputRange.length - 2];
    const responseEvent =
        type === 'link'
            ? ['focus', 'hoverIn', 'longPress', 'press', 'pressIn', 'pressOut'].includes(eventName)
            : eventName === 'focus';

    const toValue = responseEvent ? borderInputRange[2] : value;

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
        if (['link', 'outlined'].includes(type)) {
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

    const backgroundColor = colorAnimated.interpolate(backgroundColorType[type]);
    const color = colorAnimated.interpolate(colorType[type]);
    const borderColor = borderAnimated.interpolate({
        inputRange: borderInputRange,
        outputRange: [
            disabledBackgroundColor,
            type === 'link'
                ? theme.color.convertHexToRGBA(theme.palette.outline.outline, 0)
                : theme.color.convertHexToRGBA(theme.palette.outline.outline, 1),
            theme.palette.primary.primary,
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
            ...(!['text', 'link'].includes(type) && {backgroundColor}),
            ...(['outlined', 'link'].includes(type) && {borderColor}),
            color,
        },
    ];
};
