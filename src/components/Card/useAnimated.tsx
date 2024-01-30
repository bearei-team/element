import {useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {HOOK} from '../../hooks/hook';
import {AnimatedTiming} from '../../utils/animatedTiming.utils';
import {UTIL} from '../../utils/util';
import {RenderProps} from './CardBase';

export type UseAnimatedOptions = Pick<RenderProps, 'disabled' | 'type' | 'eventName'>;

export interface ProcessOutlinedAnimatedOptions extends UseAnimatedOptions {
    animatedTiming: AnimatedTiming;
    borderAnimated: Animated.Value;
    borderInputRange: number[];
}

const processOutlinedAnimated = ({
    animatedTiming,
    borderAnimated,
    borderInputRange,
    disabled,
    eventName,
}: ProcessOutlinedAnimatedOptions) => {
    const value = disabled ? 0 : borderInputRange[borderInputRange.length - 2];
    const toValue = eventName === 'focus' ? borderInputRange[2] : value;

    return animatedTiming(borderAnimated, {toValue});
};

export const useAnimated = ({disabled, type = 'filled', eventName}: UseAnimatedOptions) => {
    const [borderAnimated] = HOOK.useAnimatedValue(1);
    const [colorAnimated] = HOOK.useAnimatedValue(1);
    const borderInputRange = useMemo(() => [0, 1, 2], []);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const disabledBackgroundColor = theme.color.rgba(theme.palette.surface.onSurface, 0.12);
    const disabledColor = theme.color.rgba(theme.palette.surface.onSurface, 0.38);
    const backgroundColorType = {
        elevated: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.color.rgba(theme.palette.surface.surfaceContainerLow, 1),
            ],
        },
        filled: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.color.rgba(theme.palette.primary.primary, 1),
            ],
        },
        outlined: {
            inputRange: [0, 1],
            outputRange: [
                theme.color.rgba(theme.palette.primary.primary, 0),
                theme.color.rgba(theme.palette.primary.primary, 0),
            ],
        },
    };

    const colorType = {
        elevated: {
            inputRange: [0, 1],
            outputRange: [disabledColor, theme.color.rgba(theme.palette.primary.primary, 1)],
        },
        filled: {
            inputRange: [0, 1],
            outputRange: [disabledColor, theme.color.rgba(theme.palette.primary.onPrimary, 1)],
        },
        outlined: {
            inputRange: [0, 1],
            outputRange: [disabledColor, theme.color.rgba(theme.palette.primary.primary, 1)],
        },
        text: {
            inputRange: [0, 1],
            outputRange: [disabledColor, theme.color.rgba(theme.palette.primary.primary, 1)],
        },
        link: {
            inputRange: [0, 1],
            outputRange: [disabledColor, theme.color.rgba(theme.palette.primary.primary, 1)],
        },
        tonal: {
            inputRange: [0, 1],
            outputRange: [
                disabledColor,
                theme.color.rgba(theme.palette.secondary.onSecondaryContainer, 1),
            ],
        },
    };

    const backgroundColor = colorAnimated.interpolate(backgroundColorType[type]);
    const color = colorAnimated.interpolate(colorType[type]);
    const borderColor = borderAnimated.interpolate({
        inputRange: borderInputRange,
        outputRange: [
            disabledBackgroundColor,
            theme.color.rgba(theme.palette.outline.outline, 1),
            theme.palette.primary.primary,
        ],
    });

    useEffect(() => {
        const toValue = disabled ? 0 : 1;

        requestAnimationFrame(() => {
            if (type === 'outlined') {
                return Animated.parallel([
                    processOutlinedAnimated({
                        disabled,
                        type,
                        eventName,
                        borderInputRange,
                        borderAnimated,
                        animatedTiming,
                    }),
                    animatedTiming(colorAnimated, {toValue}),
                ]).start();
            }

            animatedTiming(colorAnimated, {toValue}).start();
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
            color,
        },
    ];
};
