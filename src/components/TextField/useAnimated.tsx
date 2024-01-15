import {useCallback, useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {HOOK} from '../../hooks/hook';
import {UTIL} from '../../utils/util';
import {EventName, State} from '../Common/interface';
import {RenderProps} from './TextFieldBase';

export interface UseAnimatedOptions extends Pick<RenderProps, 'type' | 'error' | 'disabled'> {
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
    const disabledBackgroundColor = theme.color.rgba(theme.palette.surface.onSurface, 0.12);
    const disabledColor = theme.color.rgba(theme.palette.surface.onSurface, 0.38);
    const backgroundColorConfig = {
        filled: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.color.rgba(theme.palette.surface.surfaceContainerHighest, 1),
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
                outputRange: [disabledColor, theme.color.rgba(theme.palette.surface.onSurface, 1)],
            }),
        [disabledColor, inputAnimated, theme.color, theme.palette.surface.onSurface],
    );

    const labelTextColor = colorAnimated.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [
            disabledColor,
            theme.color.rgba(theme.palette.surface.onSurfaceVariant, 1),
            theme.color.rgba(theme.palette.primary.primary, 1),
            theme.color.rgba(theme.palette.error.error, 1),
        ],
    });

    const activeIndicatorBackgroundColor = colorAnimated.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [
            disabledColor,
            theme.color.rgba(theme.palette.surface.onSurfaceVariant, 1),
            theme.color.rgba(theme.palette.primary.primary, 1),
            theme.color.rgba(theme.palette.error.error, 1),
        ],
    });

    const backgroundColor = backgroundColorAnimated.interpolate(backgroundColorConfig[type]);
    const labelTextTop = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.adaptSize(theme.spacing.small), theme.adaptSize(theme.spacing.medium)],
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
            theme.color.rgba(theme.palette.surface.onSurfaceVariant, 1),
            theme.color.rgba(theme.palette.error.error, 1),
        ],
    });

    const processEnabledState = useCallback(() => {
        if (error) {
            return requestAnimationFrame(() => {
                animatedTiming(labeAnimated, {
                    toValue: filledToValue,
                    useNativeDriver: false,
                }).start();
            });
        }

        const compositeAnimations = [
            animatedTiming(colorAnimated, {toValue: 1}),
            animatedTiming(activeIndicatorAnimated, {toValue: 0}),
            animatedTiming(labeAnimated, {
                toValue: filledToValue,
                useNativeDriver: false,
            }),
        ];

        requestAnimationFrame(() => {
            Animated.parallel(compositeAnimations).start();
        });
    }, [
        activeIndicatorAnimated,
        animatedTiming,
        colorAnimated,
        error,
        filledToValue,
        labeAnimated,
    ]);

    const processDisabledState = useCallback(() => {
        const toValue = 0;

        requestAnimationFrame(() => {
            Animated.parallel([
                animatedTiming(backgroundColorAnimated, {toValue}),
                animatedTiming(colorAnimated, {toValue}),
                animatedTiming(supportingTextAnimated, {toValue}),
                animatedTiming(activeIndicatorAnimated, {toValue}),
                animatedTiming(inputAnimated, {toValue}),
            ]).start();
        });
    }, [
        activeIndicatorAnimated,
        animatedTiming,
        backgroundColorAnimated,
        colorAnimated,
        inputAnimated,
        supportingTextAnimated,
    ]);

    const processErrorState = useCallback(() => {
        requestAnimationFrame(() => {
            Animated.parallel([
                animatedTiming(colorAnimated, {toValue: 3}),
                animatedTiming(supportingTextAnimated, {toValue: 2}),
                animatedTiming(activeIndicatorAnimated, {toValue: 1}),
            ]).start();
        });
    }, [activeIndicatorAnimated, animatedTiming, colorAnimated, supportingTextAnimated]);

    const processFocusedState = useCallback(() => {
        if (error) {
            return requestAnimationFrame(() => {
                animatedTiming(labeAnimated, {
                    toValue: 0,
                    useNativeDriver: false,
                }).start();
            });
        }

        const compositeAnimations = [
            animatedTiming(colorAnimated, {toValue: 2}),
            animatedTiming(activeIndicatorAnimated, {toValue: 1}),
            animatedTiming(labeAnimated, {toValue: 0, useNativeDriver: false}),
        ];

        requestAnimationFrame(() => {
            Animated.parallel(compositeAnimations).start();
        });
    }, [activeIndicatorAnimated, animatedTiming, colorAnimated, error, labeAnimated]);

    const stateAnimated = useMemo(
        () =>
            ({
                disabled: processDisabledState,
                enabled: processEnabledState,
                error: processErrorState,
                focused: processFocusedState,
            } as Record<State, () => void | undefined>),
        [processDisabledState, processEnabledState, processErrorState, processFocusedState],
    );

    useEffect(() => {
        stateAnimated[state]?.();
    }, [state, stateAnimated]);

    useEffect(() => {
        const nonerror = typeof error !== 'boolean' && disabled;

        if (nonerror) {
            return;
        }

        stateAnimated[error ? 'error' : state]?.();
    }, [disabled, error, state, stateAnimated]);

    useEffect(() => {
        if (typeof disabled !== 'boolean') {
            return;
        }

        stateAnimated[disabled ? 'disabled' : state]?.();
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
