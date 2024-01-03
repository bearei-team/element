import {useCallback, useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {RenderProps} from './ButtonBase';

export type UseAnimatedOptions = Required<
    Pick<RenderProps, 'disabled' | 'state' | 'type' | 'fabType' | 'category'>
>;

export const useAnimated = (options: UseAnimatedOptions) => {
    const [borderAnimated] = useAnimatedValue(1);
    const [colorAnimated] = useAnimatedValue(1);
    const {category, disabled, fabType, state, type} = options;
    const borderInputRange = useMemo(() => [0, 1, 2], []);
    const theme = useTheme();
    const disabledBackgroundColor = theme.color.rgba(
        theme.palette.surface.onSurface,
        0.12,
    );

    const disabledColor = theme.color.rgba(
        theme.palette.surface.onSurface,
        0.38,
    );

    const commonBackgroundColorConfig = {
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

    const fabBackgroundColorConfig = {
        surface: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.palette.surface.surfaceContainerHigh,
            ],
        },
        primary: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.palette.primary.primaryContainer,
            ],
        },
        secondary: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.palette.secondary.secondaryContainer,
            ],
        },
        tertiary: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.palette.tertiary.tertiaryContainer,
            ],
        },
    };

    const commonColorConfig = {
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

    const fabColorConfig = {
        surface: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.palette.primary.primary,
            ],
        },
        primary: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.palette.primary.onPrimaryContainer,
            ],
        },
        secondary: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.palette.secondary.onSecondaryContainer,
            ],
        },
        tertiary: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.palette.tertiary.onTertiaryContainer,
            ],
        },
    };

    const {backgroundColorConfig, colorConfig} =
        category === 'fab'
            ? {
                  backgroundColorConfig: fabBackgroundColorConfig[fabType],
                  colorConfig: fabColorConfig[fabType],
              }
            : {
                  backgroundColorConfig: commonBackgroundColorConfig[type],
                  colorConfig: commonColorConfig[type],
              };

    const backgroundColor = colorAnimated.interpolate(backgroundColorConfig);
    const color = colorAnimated.interpolate(colorConfig);
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

    const processAnimatedTiming = useCallback(
        (animation: Animated.Value, toValue: number) => {
            const animatedTiming = UTIL.animatedTiming(theme);

            requestAnimationFrame(() =>
                animatedTiming(animation, {
                    duration: 'short3',
                    easing: 'standard',
                    toValue,
                }).start(),
            );
        },
        [theme],
    );

    useEffect(() => {
        if (['outlined', 'link'].includes(type)) {
            const value = disabled
                ? 0
                : borderInputRange[borderInputRange.length - 2];

            const responseEvent =
                type === 'link'
                    ? ['focused', 'pressIn', 'hovered'].includes(state)
                    : state === 'focused';

            const toValue = responseEvent ? borderInputRange[2] : value;

            processAnimatedTiming(borderAnimated, toValue);
        }

        processAnimatedTiming(colorAnimated, disabled ? 0 : 1);
    }, [
        borderAnimated,
        borderInputRange,
        colorAnimated,
        disabled,
        processAnimatedTiming,
        state,
        type,
    ]);

    return {
        ...(!['text', 'link'].includes(type) && {backgroundColor}),
        ...(['outlined', 'link'].includes(type) && {borderColor}),
        color,
    };
};
