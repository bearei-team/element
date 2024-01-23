import {useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {HOOK} from '../../hooks/hook';
import {AnimatedTiming} from '../../utils/animatedTiming.utils';
import {UTIL} from '../../utils/util';
import {EventName, State} from '../Common/interface';
import {RenderProps} from './TextFieldBase';

export interface UseAnimatedOptions extends Pick<RenderProps, 'type' | 'error' | 'disabled'> {
    eventName: EventName;
    state: State;
    filled: boolean;
}

export interface ProcessEnabledOptions extends Pick<RenderProps, 'error'> {
    activeIndicatorAnimated: Animated.Value;
    colorAnimated: Animated.Value;
    filledToValue: number;
    labelAnimated: Animated.Value;
    animatedTiming: AnimatedTiming;
}

export interface ProcessDisabledOptions {
    activeIndicatorAnimated: Animated.Value;
    backgroundColorAnimated: Animated.Value;
    colorAnimated: Animated.Value;
    inputAnimated: Animated.Value;
    supportingTextAnimated: Animated.Value;
    animatedTiming: AnimatedTiming;
}

export interface ProcessErrorOptions {
    colorAnimated: Animated.Value;
    supportingTextAnimated: Animated.Value;
    activeIndicatorAnimated: Animated.Value;
    animatedTiming: AnimatedTiming;
}

export interface FocusedOptions extends Pick<UseAnimatedOptions, 'error'> {
    labelAnimated: Animated.Value;
    colorAnimated: Animated.Value;
    activeIndicatorAnimated: Animated.Value;
    animatedTiming: AnimatedTiming;
}

const processEnabled =
    ({
        activeIndicatorAnimated,
        colorAnimated,
        error,
        filledToValue,
        labelAnimated,
        animatedTiming,
    }: ProcessEnabledOptions) =>
    () => {
        if (error) {
            return requestAnimationFrame(() => {
                animatedTiming(labelAnimated, {
                    toValue: filledToValue,
                }).start();
            });
        }

        const compositeAnimations = [
            animatedTiming(colorAnimated, {toValue: 1}),
            animatedTiming(activeIndicatorAnimated, {toValue: 0}),
            animatedTiming(labelAnimated, {toValue: filledToValue}),
        ];

        requestAnimationFrame(() => {
            Animated.parallel(compositeAnimations).start();
        });
    };

const processDisabled =
    ({
        backgroundColorAnimated,
        colorAnimated,
        supportingTextAnimated,
        activeIndicatorAnimated,
        inputAnimated,
        animatedTiming,
    }: ProcessDisabledOptions) =>
    () => {
        const toValue = 0;

        requestAnimationFrame(() => {
            Animated.parallel([
                animatedTiming(activeIndicatorAnimated, {toValue}),
                animatedTiming(backgroundColorAnimated, {toValue}),
                animatedTiming(colorAnimated, {toValue}),
                animatedTiming(inputAnimated, {toValue}),
                animatedTiming(supportingTextAnimated, {toValue}),
            ]).start();
        });
    };

const processError =
    ({
        activeIndicatorAnimated,
        animatedTiming,
        colorAnimated,
        supportingTextAnimated,
    }: ProcessErrorOptions) =>
    () =>
        requestAnimationFrame(() => {
            Animated.parallel([
                animatedTiming(activeIndicatorAnimated, {toValue: 1}),
                animatedTiming(colorAnimated, {toValue: 3}),
                animatedTiming(supportingTextAnimated, {toValue: 2}),
            ]).start();
        });

const processFocused =
    ({
        animatedTiming,
        labelAnimated,
        colorAnimated,
        activeIndicatorAnimated,
        error,
    }: FocusedOptions) =>
    () => {
        if (error) {
            return requestAnimationFrame(() => {
                animatedTiming(labelAnimated, {toValue: 0}).start();
            });
        }

        const compositeAnimations = [
            animatedTiming(activeIndicatorAnimated, {toValue: 1}),
            animatedTiming(colorAnimated, {toValue: 2}),
            animatedTiming(labelAnimated, {toValue: 0}),
        ];

        requestAnimationFrame(() => {
            Animated.parallel(compositeAnimations).start();
        });
    };

export const useAnimated = ({
    type = 'filled',
    state,
    error,
    disabled,
    filled,
}: UseAnimatedOptions) => {
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const [backgroundColorAnimated] = HOOK.useAnimatedValue(1);
    const [inputAnimated] = HOOK.useAnimatedValue(1);
    const [colorAnimated] = HOOK.useAnimatedValue(1);
    const [activeIndicatorAnimated] = HOOK.useAnimatedValue(0);
    const filledToValue = filled ? 0 : 1;
    const [labelAnimated] = HOOK.useAnimatedValue(filledToValue);
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
    const labelTextTop = labelAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.adaptSize(theme.spacing.small), theme.adaptSize(theme.spacing.medium)],
    });

    const labelTextSize = labelAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.adaptFontSize(theme.typography.body.small.size),
            theme.adaptFontSize(theme.typography.body.large.size),
        ],
    });

    const labelTextLineHeight = labelAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.adaptSize(theme.typography.body.small.lineHeight),
            theme.adaptSize(theme.typography.body.large.lineHeight),
        ],
    });

    const labelTextHeight = labelAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.adaptSize(theme.typography.body.small.lineHeight),
            theme.adaptSize(theme.typography.body.large.lineHeight),
        ],
    });

    const labelTextLetterSpacing = labelAnimated.interpolate({
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

    const processEnabledState = useMemo(
        () =>
            processEnabled({
                activeIndicatorAnimated,
                colorAnimated,
                error,
                filledToValue,
                labelAnimated,
                animatedTiming,
            }),
        [
            activeIndicatorAnimated,
            animatedTiming,
            colorAnimated,
            error,
            filledToValue,
            labelAnimated,
        ],
    );

    const processDisabledState = useMemo(
        () =>
            processDisabled({
                backgroundColorAnimated,
                colorAnimated,
                supportingTextAnimated,
                activeIndicatorAnimated,
                inputAnimated,
                animatedTiming,
            }),
        [
            activeIndicatorAnimated,
            animatedTiming,
            backgroundColorAnimated,
            colorAnimated,
            inputAnimated,
            supportingTextAnimated,
        ],
    );

    const processErrorState = useMemo(
        () =>
            processError({
                colorAnimated,
                supportingTextAnimated,
                activeIndicatorAnimated,
                animatedTiming,
            }),
        [activeIndicatorAnimated, animatedTiming, colorAnimated, supportingTextAnimated],
    );

    const processFocusedState = useMemo(
        () =>
            processFocused({
                animatedTiming,
                labelAnimated,
                colorAnimated,
                activeIndicatorAnimated,
                error,
            }),
        [activeIndicatorAnimated, animatedTiming, colorAnimated, error, labelAnimated],
    );

    const stateAnimated = useMemo(
        () =>
            ({
                disabled: processDisabledState,
                enabled: processEnabledState,
                error: processErrorState,
                focused: processFocusedState,
            } as Record<State, () => void | undefined | number>),
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
