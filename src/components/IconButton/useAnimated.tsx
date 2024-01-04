import {useCallback, useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {RenderProps} from './IconButtonBase';

export type UseAnimatedOptions = Required<
    Pick<RenderProps, 'disabled' | 'type' | 'eventName'>
>;

export const useAnimated = (options: UseAnimatedOptions) => {
    const {disabled, type, eventName} = options;
    const [borderAnimated] = useAnimatedValue(1);
    const [colorAnimated] = useAnimatedValue(1);
    const borderInputRange = useMemo(() => [0, 1, 2], []);
    const theme = useTheme();
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
        inputRange: borderInputRange,
        outputRange: [
            disabledBackgroundColor,
            theme.palette.outline.outline,
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
        if (type === 'outlined') {
            const value = disabled
                ? 0
                : borderInputRange[borderInputRange.length - 2];

            // const responseEvent =
            //     type === 'link'
            //         ? [
            //               'focus',
            //               'hoverIn',
            //               'longPress',
            //               'press',
            //               'pressIn',
            //               'pressOut',
            //           ].includes(eventName)
            //         : eventName === 'focus';

            const toValue = eventName === 'focus' ? borderInputRange[2] : value;

            processAnimatedTiming(borderAnimated, toValue);
        }

        processAnimatedTiming(colorAnimated, disabled ? 0 : 1);
    }, [
        borderAnimated,
        borderInputRange,
        colorAnimated,
        disabled,
        eventName,
        processAnimatedTiming,
        type,
    ]);

    return {
        ...(type !== 'standard' && {backgroundColor}),
        ...(type === 'outlined' && {borderColor}),
    };
};
