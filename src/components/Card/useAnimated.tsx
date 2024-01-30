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
                theme.color.rgba(theme.palette.surface.surfaceContainerHighest, 1),
            ],
        },
        outlined: {
            inputRange: [0, 1],
            outputRange: [
                theme.color.rgba(theme.palette.surface.surface, 1),
                theme.color.rgba(theme.palette.surface.surface, 1),
            ],
        },
    };

    const backgroundColor = colorAnimated.interpolate(backgroundColorType[type]);
    const titleColor = colorAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [disabledColor, theme.color.rgba(theme.palette.surface.onSurface, 1)],
    });

    const subColor = colorAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [disabledColor, theme.color.rgba(theme.palette.surface.onSurfaceVariant, 1)],
    });

    const borderColor = borderAnimated.interpolate({
        inputRange: borderInputRange,
        outputRange: [
            disabledBackgroundColor,
            theme.color.rgba(theme.palette.outline.outlineVariant, 1),
            theme.color.rgba(theme.palette.surface.onSurface, 1),
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
            titleColor,
            subColor,
        },
    ];
};
