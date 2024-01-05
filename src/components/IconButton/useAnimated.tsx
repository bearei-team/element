import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {RenderProps} from './IconButtonBase';

export type UseAnimatedOptions = Required<
    Pick<RenderProps, 'disabled' | 'type'>
>;

export const useAnimated = (options: UseAnimatedOptions) => {
    const {disabled, type} = options;
    const [borderAnimated] = useAnimatedValue(1);
    const [colorAnimated] = useAnimatedValue(1);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const disabledBackgroundColor = theme.color.rgba(
        theme.palette.surface.onSurface,
        0.12,
    );

    const backgroundColorConfig = {
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
        standard: {
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

    const backgroundColor = colorAnimated.interpolate(
        backgroundColorConfig[type],
    );

    const borderColor = borderAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [disabledBackgroundColor, theme.palette.outline.outline],
    });

    const processAnimatedTiming = useCallback(
        (animation: Animated.Value, toValue: number) => {
            requestAnimationFrame(() =>
                animatedTiming(animation, {
                    duration: 'short3',
                    easing: 'standard',
                    toValue,
                    useNativeDriver: true,
                }).start(),
            );
        },
        [animatedTiming],
    );

    useEffect(() => {
        if (type === 'outlined') {
            const value = disabled ? 0 : 1;

            processAnimatedTiming(borderAnimated, value);
        }

        processAnimatedTiming(colorAnimated, disabled ? 0 : 1);
    }, [borderAnimated, colorAnimated, disabled, processAnimatedTiming, type]);

    return [
        {
            ...(type !== 'standard' && {backgroundColor}),
            ...(type === 'outlined' && {borderColor}),
        },
    ];
};
