import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../utils/animatedTiming.utils';
import {RenderProps} from './IconButtonBase';

type UseAnimatedOptions = Pick<RenderProps, 'disabled' | 'type'>;
interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    colorAnimated: Animated.Value;
    borderAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {disabled, type = 'filled', colorAnimated, borderAnimated}: ProcessAnimatedTimingOptions,
) => {
    const toValue = disabled ? 0 : 1;

    if (type === 'outlined') {
        return Animated.parallel([
            animatedTiming(borderAnimated, {toValue}),
            animatedTiming(colorAnimated, {toValue}),
        ]).start();
    }

    animatedTiming(colorAnimated, {toValue}).start();
};

export const useAnimated = ({disabled, type = 'filled'}: UseAnimatedOptions) => {
    const animatedValue = disabled ? 0 : 1;
    const [borderAnimated] = useAnimatedValue(animatedValue);
    const [colorAnimated] = useAnimatedValue(animatedValue);
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

        return () => {
            borderAnimated.stopAnimation();
            colorAnimated.stopAnimation();
        };
    }, [animatedTiming, borderAnimated, colorAnimated, disabled, type]);

    return [
        {
            ...(type !== 'standard' && {backgroundColor}),
            ...(type === 'outlined' && {borderColor}),
        },
    ];
};
