import {useCallback, useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {HOOK} from '../../hooks/hook';
import {UTIL} from '../../utils/util';
import {RenderProps} from './ButtonBase';

export type UseAnimatedOptions = Required<
    Pick<RenderProps, 'disabled' | 'type' | 'eventName'>
>;

export const useAnimated = (options: UseAnimatedOptions) => {
    const {disabled, type, eventName} = options;
    const [borderAnimated] = HOOK.useAnimatedValue(1);
    const [colorAnimated] = HOOK.useAnimatedValue(1);
    const borderInputRange = useMemo(() => [0, 1, 2], []);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const disabledBackgroundColor = theme.color.rgba(
        theme.palette.surface.onSurface,
        0.12,
    );

    const disabledColor = theme.color.rgba(
        theme.palette.surface.onSurface,
        0.38,
    );

    const backgroundColorType = {
        elevated: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.palette.surface.surfaceContainerLow,
            ],
        },
        filled: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.palette.primary.primary,
            ],
        },
        outlined: {
            inputRange: [0, 1],
            outputRange: [
                theme.color.rgba(theme.palette.primary.primary, 0),
                theme.color.rgba(theme.palette.primary.primary, 0),
            ],
        },
        text: {
            inputRange: [0, 1],
            outputRange: [
                theme.color.rgba(theme.palette.primary.primary, 0),
                theme.color.rgba(theme.palette.primary.primary, 0),
            ],
        },
        link: {
            inputRange: [0, 1],
            outputRange: [
                theme.color.rgba(theme.palette.primary.primary, 0),
                theme.color.rgba(theme.palette.primary.primary, 0),
            ],
        },
        tonal: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.palette.secondary.secondaryContainer,
            ],
        },
    };

    const colorType = {
        elevated: {
            inputRange: [0, 1],
            outputRange: [disabledColor, theme.palette.primary.primary],
        },
        filled: {
            inputRange: [0, 1],
            outputRange: [disabledColor, theme.palette.primary.onPrimary],
        },
        outlined: {
            inputRange: [0, 1],
            outputRange: [disabledColor, theme.palette.primary.primary],
        },
        text: {
            inputRange: [0, 1],
            outputRange: [disabledColor, theme.palette.primary.primary],
        },
        link: {
            inputRange: [0, 1],
            outputRange: [disabledColor, theme.palette.primary.primary],
        },
        tonal: {
            inputRange: [0, 1],
            outputRange: [
                disabledColor,
                theme.palette.secondary.onSecondaryContainer,
            ],
        },
    };

    const backgroundColor = colorAnimated.interpolate(
        backgroundColorType[type],
    );

    const color = colorAnimated.interpolate(colorType[type]);
    const borderColor = borderAnimated.interpolate({
        inputRange: borderInputRange,
        outputRange: [
            disabledBackgroundColor,
            type === 'link'
                ? theme.color.rgba(theme.palette.outline.outline, 0)
                : theme.palette.outline.outline,
            theme.palette.primary.primary,
        ],
    });

    const processOutlinedAndLinkAnimatedTiming = useCallback(() => {
        const value = disabled
            ? 0
            : borderInputRange[borderInputRange.length - 2];

        const responseEvent =
            type === 'link'
                ? [
                      'focus',
                      'hoverIn',
                      'longPress',
                      'press',
                      'pressIn',
                      'pressOut',
                  ].includes(eventName)
                : eventName === 'focus';

        const toValue = responseEvent ? borderInputRange[2] : value;

        return animatedTiming(borderAnimated, {toValue});
    }, [
        animatedTiming,
        borderAnimated,
        borderInputRange,
        disabled,
        eventName,
        type,
    ]);

    useEffect(() => {
        const toValue = disabled ? 0 : 1;

        requestAnimationFrame(() => {
            if (['link', 'outlined'].includes(type)) {
                return Animated.parallel([
                    processOutlinedAndLinkAnimatedTiming(),
                    animatedTiming(colorAnimated, {toValue}),
                ]).start();
            }

            animatedTiming(colorAnimated, {toValue}).start();
        });
    }, [
        animatedTiming,
        colorAnimated,
        disabled,
        processOutlinedAndLinkAnimatedTiming,
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
