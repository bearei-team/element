import {useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {HOOK} from '../../hooks/hook';
import {UTIL} from '../../utils/util';
import {EventName, State} from '../Common/interface';
import {RenderProps} from './TextFieldBase';

export interface UseAnimatedOptions
    extends Pick<RenderProps, 'type' | 'error' | 'disabled' | 'error'> {
    eventName: EventName;
    state: State;
    filled: boolean;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {type = 'filled', state, error, disabled, filled} = options;
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const [backgroundColorAnimated] = HOOK.useAnimatedValue(1);
    const [inputAnimated] = HOOK.useAnimatedValue(1);
    const [colorAnimated] = HOOK.useAnimatedValue(1);
    const [activeIndicatorAnimated] = HOOK.useAnimatedValue(0);
    const filledToValue = filled ? 0 : 1;
    const [labeAnimated] = HOOK.useAnimatedValue(filledToValue);
    const [supportingTextAnimated] = HOOK.useAnimatedValue(1);

    const disabledBackgroundColor = theme.color.rgba(
        theme.palette.surface.onSurface,
        0.12,
    );

    const disabledColor = theme.color.rgba(
        theme.palette.surface.onSurface,
        0.38,
    );

    const backgroundColorConfig = {
        filled: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.palette.surface.surfaceContainerHighest,
            ],
        },
        outlined: {
            inputRange: [0, 1],
            outputRange: [
                theme.color.rgba(theme.palette.surface.surface, 0),
                theme.color.rgba(theme.palette.surface.surface, 0),
            ],
        },
    };

    const inputColor = useMemo(
        () =>
            inputAnimated.interpolate({
                inputRange: [0, 1],
                outputRange: [disabledColor, theme.palette.surface.onSurface],
            }),
        [disabledColor, inputAnimated, theme.palette.surface.onSurface],
    );

    const labelTextColor = colorAnimated.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [
            disabledColor,
            theme.palette.surface.onSurfaceVariant,
            theme.palette.primary.primary,
            theme.palette.error.error,
        ],
    });

    const activeIndicatorBackgroundColor = colorAnimated.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [
            disabledColor,
            theme.palette.surface.onSurfaceVariant,
            theme.palette.primary.primary,
            theme.palette.error.error,
        ],
    });

    const backgroundColor = backgroundColorAnimated.interpolate(
        backgroundColorConfig[type],
    );

    const labelTextTop = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.adaptSize(theme.spacing.small),
            theme.adaptSize(theme.spacing.medium),
        ],
    });

    const labelTextSize = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.adaptFontSize(theme.typography.body.small.size),
            theme.adaptFontSize(theme.typography.body.large.size),
        ],
    });

    const labelTextLineHeight = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.adaptSize(theme.typography.body.small.lineHeight),
            theme.adaptSize(theme.typography.body.large.lineHeight),
        ],
    });

    const labelTextHeight = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.adaptSize(theme.typography.body.small.lineHeight),
            theme.adaptSize(theme.typography.body.large.lineHeight),
        ],
    });

    const labelTextLetterSpacing = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.adaptSize(theme.typography.body.small.letterSpacing),
            theme.adaptSize(theme.typography.body.large.letterSpacing),
        ],
    });

    const activeIndicatorScale = activeIndicatorAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0.5, 1],
    });

    const supportingTextColor = supportingTextAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [
            disabledColor,
            theme.palette.surface.onSurfaceVariant,
            theme.palette.error.error,
        ],
    });

    const stateAnimated = useMemo(
        () =>
            ({
                enabled: () => {
                    const compositeAnimations = [
                        animatedTiming(colorAnimated, {toValue: 1}),
                        animatedTiming(activeIndicatorAnimated, {toValue: 0}),
                        animatedTiming(labeAnimated, {
                            toValue: filledToValue,
                            useNativeDriver: false,
                        }),
                    ];

                    requestAnimationFrame(() => {
                        error
                            ? animatedTiming(labeAnimated, {
                                  toValue: filledToValue,
                                  useNativeDriver: false,
                              }).start()
                            : Animated.parallel(compositeAnimations).start();
                    });
                },
                disabled: () => {
                    const toValue = 0;

                    requestAnimationFrame(() => {
                        Animated.parallel([
                            animatedTiming(backgroundColorAnimated, {toValue}),
                            animatedTiming(colorAnimated, {toValue}),
                            animatedTiming(supportingTextAnimated, {
                                toValue,
                            }),
                            animatedTiming(activeIndicatorAnimated, {toValue}),
                            animatedTiming(inputAnimated, {toValue}),
                        ]).start();
                    });
                },
                error: () => {
                    requestAnimationFrame(() => {
                        Animated.parallel([
                            animatedTiming(colorAnimated, {toValue: 3}),
                            animatedTiming(supportingTextAnimated, {
                                toValue: 2,
                            }),
                            animatedTiming(activeIndicatorAnimated, {
                                toValue: 1,
                            }),
                        ]).start();
                    });
                },
                focused: () => {
                    const compositeAnimations = [
                        animatedTiming(colorAnimated, {toValue: 2}),
                        animatedTiming(activeIndicatorAnimated, {toValue: 1}),
                        animatedTiming(labeAnimated, {
                            toValue: 0,
                            useNativeDriver: false,
                        }),
                    ];

                    requestAnimationFrame(() => {
                        error
                            ? animatedTiming(labeAnimated, {
                                  toValue: 0,
                                  useNativeDriver: false,
                              }).start()
                            : Animated.parallel(compositeAnimations).start();
                    });
                },
            } as Record<State, () => void | undefined>),
        [
            activeIndicatorAnimated,
            animatedTiming,
            backgroundColorAnimated,
            colorAnimated,
            error,
            filledToValue,
            inputAnimated,
            labeAnimated,
            supportingTextAnimated,
        ],
    );

    useEffect(() => {
        stateAnimated[state]?.();
    }, [state, stateAnimated]);

    useEffect(() => {
        if (typeof error === 'boolean' && !disabled) {
            error ? stateAnimated.error() : stateAnimated[state]?.();
        }
    }, [disabled, error, state, stateAnimated]);

    useEffect(() => {
        if (typeof disabled === 'boolean') {
            disabled ? stateAnimated.disabled() : stateAnimated[state]?.();
        }
    }, [disabled, state, stateAnimated]);

    return [
        {
            labelTextLetterSpacing,
            activeIndicatorBackgroundColor,
            activeIndicatorScale,
            backgroundColor,
            inputColor,
            labelTextColor,
            labelTextHeight,
            labelTextLineHeight,
            labelTextSize,
            labelTextTop,
            supportingTextColor,
        },
    ];
};
