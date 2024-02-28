import {useCallback, useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../utils/animatedTiming.utils';
import {EventName, State} from '../Common/interface';
import {RenderProps} from './TextFieldBase';

interface UseAnimatedOptions extends Pick<RenderProps, 'type' | 'error' | 'disabled'> {
    eventName: EventName;
    filled: boolean;
    state: State;
}

interface ProcessEnabledOptions extends Pick<UseAnimatedOptions, 'error'> {
    activeIndicatorAnimated: Animated.Value;
    animatedTiming: AnimatedTiming;
    colorAnimated: Animated.Value;
    filledToValue: number;
    inputAnimated: Animated.Value;
    labelAnimated: Animated.Value;
    supportingTextAnimated: Animated.Value;
}

interface ProcessDisabledOptions {
    activeIndicatorAnimated: Animated.Value;
    animatedTiming: AnimatedTiming;
    backgroundColorAnimated: Animated.Value;
    colorAnimated: Animated.Value;
    inputAnimated: Animated.Value;
    supportingTextAnimated: Animated.Value;
}

interface ProcessErrorOptions {
    activeIndicatorAnimated: Animated.Value;
    animatedTiming: AnimatedTiming;
    colorAnimated: Animated.Value;
    inputAnimated: Animated.Value;
    supportingTextAnimated: Animated.Value;
}

interface ProcessFocusedOptions extends Pick<UseAnimatedOptions, 'error'> {
    activeIndicatorAnimated: Animated.Value;
    animatedTiming: AnimatedTiming;
    colorAnimated: Animated.Value;
    labelAnimated: Animated.Value;
}

interface ProcessStateAnimatedOptions {
    stateAnimated: Record<State, () => void | undefined | number>;
}

type ProcessNonerrorAnimatedOptions = ProcessStateAnimatedOptions &
    Pick<UseAnimatedOptions, 'disabled' | 'error'>;

type ProcessDisabledAnimatedOptions = ProcessStateAnimatedOptions &
    Pick<UseAnimatedOptions, 'disabled'>;

const processEnabled = ({
    activeIndicatorAnimated,
    animatedTiming,
    colorAnimated,
    error,
    filledToValue,
    inputAnimated,
    labelAnimated,
    supportingTextAnimated,
}: ProcessEnabledOptions) => {
    if (error) {
        return requestAnimationFrame(() =>
            animatedTiming(labelAnimated, {toValue: filledToValue}).start(),
        );
    }

    const compositeAnimations = [
        animatedTiming(activeIndicatorAnimated, {toValue: 0}),
        animatedTiming(colorAnimated, {toValue: 1}),
        animatedTiming(inputAnimated, {toValue: 1}),
        animatedTiming(labelAnimated, {toValue: filledToValue}),
        animatedTiming(supportingTextAnimated, {toValue: 1}),
    ];

    requestAnimationFrame(() => Animated.parallel(compositeAnimations).start());
};

const processDisabled = ({
    activeIndicatorAnimated,
    animatedTiming,
    backgroundColorAnimated,
    colorAnimated,
    inputAnimated,
    supportingTextAnimated,
}: ProcessDisabledOptions) => {
    const toValue = 0;

    requestAnimationFrame(() =>
        Animated.parallel([
            animatedTiming(activeIndicatorAnimated, {toValue}),
            animatedTiming(backgroundColorAnimated, {toValue}),
            animatedTiming(colorAnimated, {toValue}),
            animatedTiming(inputAnimated, {toValue}),
            animatedTiming(supportingTextAnimated, {toValue}),
        ]).start(),
    );
};

const processError = ({
    activeIndicatorAnimated,
    animatedTiming,
    colorAnimated,
    inputAnimated,
    supportingTextAnimated,
}: ProcessErrorOptions) =>
    requestAnimationFrame(() =>
        Animated.parallel([
            animatedTiming(activeIndicatorAnimated, {toValue: 1}),
            animatedTiming(colorAnimated, {toValue: 3}),
            animatedTiming(inputAnimated, {toValue: 1}),
            animatedTiming(supportingTextAnimated, {toValue: 2}),
        ]).start(),
    );

const processFocused = ({
    activeIndicatorAnimated,
    animatedTiming,
    colorAnimated,
    error,
    labelAnimated,
}: ProcessFocusedOptions) => {
    if (error) {
        return requestAnimationFrame(() => animatedTiming(labelAnimated, {toValue: 0}).start());
    }

    const compositeAnimations = [
        animatedTiming(activeIndicatorAnimated, {toValue: 1}),
        animatedTiming(colorAnimated, {toValue: 2}),
        animatedTiming(labelAnimated, {toValue: 0}),
    ];

    requestAnimationFrame(() => Animated.parallel(compositeAnimations).start());
};

const processStateAnimated = (state: State, {stateAnimated}: ProcessStateAnimatedOptions) =>
    stateAnimated[state]?.();

const processNonerrorAnimated = (
    state: State,
    {stateAnimated, error, disabled}: ProcessNonerrorAnimatedOptions,
) => {
    const nonerror = typeof error !== 'boolean' && disabled;

    !nonerror && stateAnimated[error ? 'error' : state]?.();
};

const processDisabledAnimated = (
    state: State,
    {stateAnimated, disabled}: ProcessDisabledAnimatedOptions,
) => typeof disabled === 'boolean' && stateAnimated[disabled ? 'disabled' : state]?.();

export const useAnimated = ({
    disabled,
    error,
    filled,
    state,
    type = 'filled',
}: UseAnimatedOptions) => {
    const theme = useTheme();
    const disabledAnimatedValue = disabled ? 0 : 1;
    const [activeIndicatorAnimated] = useAnimatedValue(
        disabled ? disabledAnimatedValue : error ? 1 : 0,
    );

    const [backgroundColorAnimated] = useAnimatedValue(disabledAnimatedValue);
    const [colorAnimated] = useAnimatedValue(disabled ? disabledAnimatedValue : error ? 3 : 1);
    const [inputAnimated] = useAnimatedValue(disabled ? disabledAnimatedValue : error ? 3 : 1);
    const [supportingTextAnimated] = useAnimatedValue(
        disabled ? disabledAnimatedValue : error ? 2 : 1,
    );

    const animatedTiming = createAnimatedTiming(theme);
    const disabledBackgroundColor = theme.color.convertHexToRGBA(
        theme.palette.surface.onSurface,
        0.12,
    );

    const disabledColor = theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 0.38);
    const filledToValue = filled ? 0 : 1;
    const [labelAnimated] = useAnimatedValue(filledToValue);
    const backgroundColorConfig = {
        filled: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.color.convertHexToRGBA(theme.palette.surface.surfaceContainerHighest, 1),
            ],
        },
        outlined: {
            inputRange: [0, 1],
            outputRange: [
                theme.color.convertHexToRGBA(theme.palette.surface.surface, 0),
                theme.color.convertHexToRGBA(theme.palette.surface.surface, 0),
            ],
        },
    };

    const inputColor = useMemo(
        () =>
            inputAnimated.interpolate({
                inputRange: [0, 1],
                outputRange: [
                    disabledColor,
                    theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 1),
                ],
            }),
        [disabledColor, inputAnimated, theme.color, theme.palette.surface.onSurface],
    );

    const labelTextColor = colorAnimated.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [
            disabledColor,
            theme.color.convertHexToRGBA(theme.palette.surface.onSurfaceVariant, 1),
            theme.color.convertHexToRGBA(theme.palette.primary.primary, 1),
            theme.color.convertHexToRGBA(theme.palette.error.error, 1),
        ],
    });

    const activeIndicatorBackgroundColor = colorAnimated.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [
            disabledColor,
            theme.color.convertHexToRGBA(theme.palette.surface.onSurfaceVariant, 1),
            theme.color.convertHexToRGBA(theme.palette.primary.primary, 1),
            theme.color.convertHexToRGBA(theme.palette.error.error, 1),
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

    const activeIndicatorHeight = activeIndicatorAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 2],
    });

    const supportingTextColor = supportingTextAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [
            disabledColor,
            theme.color.convertHexToRGBA(theme.palette.surface.onSurfaceVariant, 1),
            theme.color.convertHexToRGBA(theme.palette.error.error, 1),
        ],
    });

    const processEnabledState = useCallback(
        () =>
            processEnabled({
                activeIndicatorAnimated,
                animatedTiming,
                colorAnimated,
                error,
                filledToValue,
                inputAnimated,
                labelAnimated,
                supportingTextAnimated,
            }),
        [
            activeIndicatorAnimated,
            animatedTiming,
            colorAnimated,
            error,
            filledToValue,
            inputAnimated,
            labelAnimated,
            supportingTextAnimated,
        ],
    );

    const processDisabledState = useCallback(
        () =>
            processDisabled({
                activeIndicatorAnimated,
                animatedTiming,
                backgroundColorAnimated,
                colorAnimated,
                inputAnimated,
                supportingTextAnimated,
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

    const processErrorState = useCallback(
        () =>
            processError({
                activeIndicatorAnimated,
                animatedTiming,
                colorAnimated,
                inputAnimated,
                supportingTextAnimated,
            }),
        [
            activeIndicatorAnimated,
            animatedTiming,
            colorAnimated,
            inputAnimated,
            supportingTextAnimated,
        ],
    );

    const processFocusedState = useCallback(
        () =>
            processFocused({
                activeIndicatorAnimated,
                animatedTiming,
                colorAnimated,
                error,
                labelAnimated,
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
        processStateAnimated(state, {stateAnimated});
    }, [state, stateAnimated]);

    useEffect(() => {
        processNonerrorAnimated(state, {stateAnimated, disabled, error});
    }, [disabled, error, state, stateAnimated]);

    useEffect(() => {
        processDisabledAnimated(state, {disabled, stateAnimated});
    }, [disabled, state, stateAnimated]);

    return [
        {
            activeIndicatorBackgroundColor,
            activeIndicatorHeight,
            backgroundColor,
            inputColor,
            labelTextColor,
            labelTextHeight,
            labelTextLetterSpacing,
            labelTextLineHeight,
            labelTextSize,
            labelTextTop,
            supportingTextColor,
        },
    ];
};
