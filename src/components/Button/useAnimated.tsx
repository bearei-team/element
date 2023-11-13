import {useCallback, useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {State} from '../common/interface';
import {Type} from './Button';

export interface UseAnimatedOptions {
    disabled: boolean;
    state: State;
    type: Type;
}

export const useAnimated = ({type, disabled, state}: UseAnimatedOptions) => {
    const [colorAnimated] = useAnimatedValue(0);
    const [borderAnimated] = useAnimatedValue(0);
    const borderInputRange = useMemo(() => [0, 1, 2], []);
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
    const borderColor = borderAnimated.interpolate({
        inputRange: borderInputRange,
        outputRange: [
            theme.palette.outline.outline,
            theme.palette.primary.primary,
            theme.color.rgba(theme.palette.surface.onSurface, 0.12),
        ],
    });

    const processAnimatedTiming = useCallback(
        (animation: Animated.Value, toValue: number) => {
            const animatedTiming = UTIL.animatedTiming(theme);

            requestAnimationFrame(() =>
                animatedTiming(animation, {
                    duration: 'short3',
                    easing: 'standard',
                    toValue: toValue,
                }).start(),
            );
        },
        [theme],
    );

    useEffect(() => {
        if (type === 'outlined') {
            const value = disabled ? borderInputRange[borderInputRange.length - 1] : 0;
            const toValue = state === 'focused' ? borderInputRange[1] : value;

            processAnimatedTiming(borderAnimated, toValue);
        }

        processAnimatedTiming(colorAnimated, disabled ? 1 : 0);
    }, [
        borderAnimated,
        borderInputRange,
        colorAnimated,
        disabled,
        processAnimatedTiming,
        state,
        type,
    ]);

    return {backgroundColor, color, ...(type === 'outlined' && {borderColor})};
};
