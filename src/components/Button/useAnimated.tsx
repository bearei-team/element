import {useCallback, useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {HOOK} from '../../hooks/hook';
import {UTIL} from '../../utils/util';
import {RenderProps} from './ButtonBase';

export type UseAnimatedOptions = Pick<RenderProps, 'disabled' | 'type' | 'eventName'>;

export interface ProcessOutlinedAndLinkAnimatedTimingOptions extends UseAnimatedOptions {
    borderAnimated: Animated.Value;
    borderInputRange: number[];
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {disabled, type = 'filled', eventName} = options;
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
                theme.color.rgba(theme.palette.secondary.secondaryContainer, 1),
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
            type === 'link'
                ? theme.color.rgba(theme.palette.outline.outline, 0)
                : theme.color.rgba(theme.palette.outline.outline, 1),
            theme.palette.primary.primary,
        ],
    });

    const processOutlinedAndLinkAnimatedTiming = useCallback(
        (
            processOutlinedAndLinkAnimatedTimingOptions: ProcessOutlinedAndLinkAnimatedTimingOptions,
        ) => {
            const {
                borderAnimated: animated,
                borderInputRange: inputRange,
                disabled: buttonDisabled,
                eventName: buttonEventName,
                type: buttonType,
            } = processOutlinedAndLinkAnimatedTimingOptions;
            const value = buttonDisabled ? 0 : inputRange[inputRange.length - 2];
            const responseEvent =
                buttonType === 'link'
                    ? ['focus', 'hoverIn', 'longPress', 'press', 'pressIn', 'pressOut'].includes(
                          buttonEventName,
                      )
                    : buttonEventName === 'focus';

            const toValue = responseEvent ? inputRange[2] : value;

            return animatedTiming(animated, {toValue});
        },
        [animatedTiming],
    );

    useEffect(() => {
        const toValue = disabled ? 0 : 1;

        requestAnimationFrame(() => {
            if (['link', 'outlined'].includes(type)) {
                return Animated.parallel([
                    processOutlinedAndLinkAnimatedTiming({
                        disabled,
                        type,
                        eventName,
                        borderInputRange,
                        borderAnimated,
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
