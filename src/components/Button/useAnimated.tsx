import {useCallback, useEffect} from 'react';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {Type} from './Button';

export interface UseAnimatedOptions {
    type: Type;
    disabled: boolean;
}

export const useAnimated = ({type, disabled}: UseAnimatedOptions) => {
    const [colorAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const {color: themeColor, palette} = theme;
    const disabledColor = themeColor.rgba(palette.surface.onSurface, 0.12);
    const backgroundColorConfig = {
        elevated: {
            inputRange: [0, 1],
            outputRange: [palette.surface.surfaceContainerLow, disabledColor],
        },
        filled: {
            inputRange: [0, 1],
            outputRange: [palette.primary.primary, disabledColor],
        },
        outlined: {
            inputRange: [0, 1],
            outputRange: [
                themeColor.rgba(palette.primary.primary, 0),
                themeColor.rgba(palette.primary.primary, 0),
            ],
        },
        text: {
            inputRange: [0, 1],
            outputRange: [themeColor.rgba(palette.primary.primary, 0), disabledColor],
        },
        tonal: {
            inputRange: [0, 1],
            outputRange: [palette.secondary.secondaryContainer, disabledColor],
        },
    };

    const colorConfig = {
        elevated: {
            inputRange: [0, 1],
            outputRange: [theme.palette.primary.primary, disabledColor],
        },
        filled: {
            inputRange: [0, 1],
            outputRange: [theme.palette.primary.onPrimary, disabledColor],
        },
        outlined: {
            inputRange: [0, 1],
            outputRange: [theme.palette.primary.primary, disabledColor],
        },
        text: {
            inputRange: [0, 1],
            outputRange: [theme.palette.primary.primary, disabledColor],
        },
        tonal: {
            inputRange: [0, 1],
            outputRange: [theme.palette.secondary.onSecondaryContainer, disabledColor],
        },
    };

    const backgroundColor = colorAnimated.interpolate(backgroundColorConfig[type]);
    const color = colorAnimated.interpolate(colorConfig[type]);
    const processAnimatedTiming = useCallback(
        (toValue: number) => {
            const animatedTiming = UTIL.animatedTiming(theme);

            requestAnimationFrame(() =>
                animatedTiming(colorAnimated, {
                    toValue: toValue,
                    easing: 'standard',
                    duration: 'short3',
                }).start(),
            );
        },
        [colorAnimated, theme],
    );

    useEffect(() => {
        processAnimatedTiming(disabled ? 1 : 0);
    }, [disabled, processAnimatedTiming]);

    return {backgroundColor, color};
};
