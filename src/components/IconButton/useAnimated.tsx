import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {HOOK} from '../../hooks/hook';
import {UTIL} from '../../utils/util';
import {RenderProps} from './IconButtonBase';

export type UseAnimatedOptions = Pick<RenderProps, 'disabled' | 'type'>;

export const useAnimated = (options: UseAnimatedOptions) => {
    const {disabled, type = 'filled'} = options;
    const [borderAnimated] = HOOK.useAnimatedValue(1);
    const [colorAnimated] = HOOK.useAnimatedValue(1);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const disabledBackgroundColor = theme.color.rgba(theme.palette.surface.onSurface, 0.12);
    const backgroundColorConfig = {
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
                theme.color.rgba(theme.palette.secondary.secondaryContainer, 1),
            ],
        },
    };

    const backgroundColor = colorAnimated.interpolate(backgroundColorConfig[type]);
    const borderColor = borderAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [disabledBackgroundColor, theme.palette.outline.outline],
    });

    useEffect(() => {
        const toValue = disabled ? 0 : 1;

        requestAnimationFrame(() => {
            if (type === 'outlined') {
                return Animated.parallel([
                    animatedTiming(borderAnimated, {toValue}),
                    animatedTiming(colorAnimated, {toValue}),
                ]).start();
            }

            animatedTiming(colorAnimated, {toValue}).start();
        });
    }, [animatedTiming, borderAnimated, colorAnimated, disabled, type]);

    return [
        {
            ...(type !== 'standard' && {backgroundColor}),
            ...(type === 'outlined' && {borderColor}),
        },
    ];
};
