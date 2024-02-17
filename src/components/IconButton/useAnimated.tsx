import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../utils/animatedTiming.utils';
import {RenderProps} from './IconButtonBase';

export type UseAnimatedOptions = Pick<RenderProps, 'disabled' | 'type'>;

export interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    colorAnimated: Animated.Value;
    borderAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {disabled, type = 'filled', colorAnimated, borderAnimated}: ProcessAnimatedTimingOptions,
) => {
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
};

export const useAnimated = ({disabled, type = 'filled'}: UseAnimatedOptions) => {
    const [borderAnimated] = useAnimatedValue(1);
    const [colorAnimated] = useAnimatedValue(1);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);
    const disabledBackgroundColor = theme.color.convertHexToRGBA(
        theme.palette.surface.onSurface,
        0.12,
    );

    const backgroundColorConfig = {
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
        standard: {
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

    const backgroundColor = colorAnimated.interpolate(backgroundColorConfig[type]);
    const borderColor = borderAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [disabledBackgroundColor, theme.palette.outline.outline],
    });

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {borderAnimated, colorAnimated, disabled, type});
    }, [animatedTiming, borderAnimated, colorAnimated, disabled, type]);

    return [
        {
            ...(type !== 'standard' && {backgroundColor}),
            ...(type === 'outlined' && {borderColor}),
        },
    ];
};
