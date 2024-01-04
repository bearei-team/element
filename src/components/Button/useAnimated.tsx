import {useCallback, useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {RenderProps} from './ButtonBase';

export type UseAnimatedOptions = Required<
    Pick<RenderProps, 'disabled' | 'type'>
>;

export const useAnimated = (options: UseAnimatedOptions) => {
    const [borderAnimated] = useAnimatedValue(1);
    const [colorAnimated] = useAnimatedValue(1);
    const {disabled, type} = options;
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

    const backgroundColorConfig = {
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

    const colorConfig = {
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
        backgroundColorConfig[type],
    );

    const color = colorAnimated.interpolate(colorConfig[type]);
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
                    useNativeDriver: true,
                }).start(),
            );
        },
        [theme],
    );

    useEffect(() => {
        // if (['outlined', 'link'].includes(type)) {
        //     const value = disabled
        //         ? 0
        //         : borderInputRange[borderInputRange.length - 2];

        //     const responseEvent =
        //         type === 'link'
        //             ? ['focused', 'pressIn', 'hovered'].includes(state)
        //             : state === 'focused';

        //     const toValue = responseEvent ? borderInputRange[2] : value;

        //     processAnimatedTiming(borderAnimated, toValue);
        // }

        processAnimatedTiming(colorAnimated, disabled ? 0 : 1);
    }, [colorAnimated, disabled, processAnimatedTiming]);

    return {
        ...(!['text', 'link'].includes(type) && {backgroundColor}),
        ...(['outlined', 'link'].includes(type) && {borderColor}),
        color,
    };
};
