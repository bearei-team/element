import {useCallback, useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {State} from '../Common/interface';
import {RenderProps} from './TextFieldBase';

export interface ProcessAnimatedTimingOptions {
    toValue: number;
    finished?: () => void;
}

export type ProcessAnimatedOptions = Pick<
    ProcessAnimatedTimingOptions,
    'finished'
>;

export interface UseAnimatedOptions
    extends Required<
        Pick<RenderProps, 'type' | 'error' | 'state' | 'disabled'>
    > {
    filled: boolean;
    labelTextWidth: number;
    leadingIconShow: boolean;
    supportingTextShow: boolean;
    finished: (focused: boolean) => void;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {
        disabled,
        error,
        filled,
        finished,
        labelTextWidth,
        leadingIconShow,
        state,
        supportingTextShow,
        type,
    } = options;

    const [activeIndicatorHeightAnimated] = useAnimatedValue(0);
    const [backgroundColorAnimated] = useAnimatedValue(1);
    const [borderAnimated] = useAnimatedValue(0);
    const [colorAnimated] = useAnimatedValue(1);
    const [inputColorAnimated] = useAnimatedValue(1);
    const filledValue = filled ? 1 : 0;
    const [inputHeightAnimated] = useAnimatedValue(filledValue);
    const [labeAnimated] = useAnimatedValue(filledValue);
    const [labelPlaceholderAnimated] = useAnimatedValue(filledValue);
    const [supportingTextColorAnimated] = useAnimatedValue(1);
    const [supportingTextColorOpacity] = useAnimatedValue(0);
    const theme = useTheme();
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

    const inputHeight = useMemo(
        () =>
            inputHeightAnimated.interpolate({
                inputRange: [0, 1],
                outputRange: [0, theme.adaptSize(theme.spacing.large)],
            }),
        [inputHeightAnimated, theme],
    );

    const inputColor = useMemo(
        () =>
            inputColorAnimated.interpolate({
                inputRange: [0, 1],
                outputRange: [disabledColor, theme.palette.surface.onSurface],
            }),
        [disabledColor, inputColorAnimated, theme.palette.surface.onSurface],
    );

    const labelSize = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.adaptFontSize(theme.typography.body.large.size),
            theme.adaptFontSize(theme.typography.body.small.size),
        ],
    });

    const labelLineHeight = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.adaptSize(theme.typography.body.large.lineHeight),
            theme.adaptSize(theme.typography.body.small.lineHeight),
        ],
    });

    const labelLineLetterSpacing = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.adaptSize(theme.typography.body.large.letterSpacing),
            theme.adaptSize(theme.typography.body.small.letterSpacing),
        ],
    });

    const labelTop = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.adaptSize(theme.spacing.medium),
            theme.adaptSize(-theme.typography.body.small.lineHeight / 2),
        ],
    });

    const labelLeft = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            leadingIconShow
                ? theme.adaptSize(theme.spacing.medium) + labelTextWidth
                : theme.adaptSize(theme.spacing.medium),
            theme.adaptSize(theme.spacing.medium),
        ],
    });

    const labelTextBackgroundWidth = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, labelTextWidth],
    });

    const labelColor = colorAnimated.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [
            disabledColor,
            theme.palette.surface.onSurfaceVariant,
            theme.palette.primary.primary,
            theme.palette.error.error,
        ],
    });

    const activeIndicatorColor = colorAnimated.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [
            disabledColor,
            theme.palette.surface.onSurfaceVariant,
            theme.palette.primary.primary,
            theme.palette.error.error,
        ],
    });

    const activeIndicatorHeight = activeIndicatorHeightAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.adaptSize(1), theme.adaptSize(2)],
    });

    const supportingTextColor = supportingTextColorAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [
            disabledColor,
            theme.palette.surface.onSurfaceVariant,
            theme.palette.error.error,
        ],
    });

    const supportingTextOpacity = supportingTextColorOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const borderColor = colorAnimated.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [
            disabledBackgroundColor,
            theme.palette.outline.outline,
            theme.palette.primary.primary,
            theme.palette.error.error,
        ],
    });

    const borderWidth = borderAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.adaptSize(1), theme.adaptSize(2)],
    });

    const backgroundColor = backgroundColorAnimated.interpolate(
        backgroundColorConfig[type],
    );

    const processAnimatedTiming = useCallback(
        (
            animation: Animated.Value,
            processAnimatedTimingOptions: ProcessAnimatedTimingOptions,
        ) => {
            const {finished: animatedFinished, toValue} =
                processAnimatedTimingOptions;

            const animatedTiming = UTIL.animatedTiming(theme);

            requestAnimationFrame(() =>
                animatedTiming(animation, {
                    duration: 'short3',
                    easing: 'standard',
                    toValue,
                }).start(animatedFinished),
            );
        },
        [theme],
    );

    const processBorderAnimated = useCallback(
        (toValue: number) =>
            type === 'filled'
                ? processAnimatedTiming(activeIndicatorHeightAnimated, {
                      toValue,
                  })
                : processAnimatedTiming(borderAnimated, {toValue}),
        [
            activeIndicatorHeightAnimated,
            borderAnimated,
            processAnimatedTiming,
            type,
        ],
    );

    const processStateChangeAnimated = useCallback(
        (processStateAnimatedOptions = {} as ProcessAnimatedOptions) => {
            const {finished: animatedFinished} = processStateAnimatedOptions;
            const processErrorAnimated = () => {
                processAnimatedTiming(colorAnimated, {toValue: 3});
                processAnimatedTiming(supportingTextColorAnimated, {
                    toValue: 2,
                });
                processBorderAnimated(1);
            };

            return {
                disabled: () => {
                    const toValue = 0;

                    processAnimatedTiming(backgroundColorAnimated, {toValue});
                    processAnimatedTiming(colorAnimated, {toValue});
                    processAnimatedTiming(inputColorAnimated, {toValue});
                    processAnimatedTiming(supportingTextColorAnimated, {
                        toValue,
                    });
                    processBorderAnimated(toValue);
                },
                enabled: () => {
                    processAnimatedTiming(inputColorAnimated, {toValue: 1});
                    processAnimatedTiming(inputHeightAnimated, {
                        toValue: filledValue,
                    });
                    processAnimatedTiming(labeAnimated, {toValue: filledValue});
                    processAnimatedTiming(labelPlaceholderAnimated, {
                        toValue: filledValue,
                    });

                    if (error) {
                        return processErrorAnimated();
                    }

                    processAnimatedTiming(colorAnimated, {toValue: 1});
                    processAnimatedTiming(supportingTextColorAnimated, {
                        toValue: 1,
                    });
                    processBorderAnimated(0);
                },
                error: () => {
                    processErrorAnimated();
                },
                focused: () => {
                    processAnimatedTiming(inputHeightAnimated, {toValue: 1});
                    processAnimatedTiming(labeAnimated, {
                        toValue: 1,
                        finished: animatedFinished,
                    });
                    processAnimatedTiming(labelPlaceholderAnimated, {
                        toValue: 1,
                    });

                    if (error) {
                        return processErrorAnimated();
                    }

                    processAnimatedTiming(colorAnimated, {toValue: 2});
                    processBorderAnimated(1);
                },
            } as Record<State, () => void>;
        },
        [
            backgroundColorAnimated,
            colorAnimated,
            error,
            filledValue,
            inputColorAnimated,
            inputHeightAnimated,
            labeAnimated,
            labelPlaceholderAnimated,
            processAnimatedTiming,
            processBorderAnimated,
            supportingTextColorAnimated,
        ],
    );

    const processAnimated = useCallback(
        (
            nextState: State,
            processAnimatedOptions: ProcessAnimatedOptions = {},
        ) => {
            processStateChangeAnimated(processAnimatedOptions)[nextState]?.();

            nextState !== 'disabled' &&
                processAnimatedTiming(backgroundColorAnimated, {toValue: 1});
        },
        [
            backgroundColorAnimated,
            processAnimatedTiming,
            processStateChangeAnimated,
        ],
    );

    useEffect(() => {
        processAnimatedTiming(supportingTextColorOpacity, {
            toValue: supportingTextShow ? 1 : 0,
        });
    }, [processAnimatedTiming, supportingTextShow, supportingTextColorOpacity]);

    useEffect(() => {
        const focused = ['focused', 'pressIn', 'longPressIn'].includes(state);

        processAnimated(focused ? 'focused' : state, {
            finished: () => finished(focused),
        });
    }, [finished, processAnimated, state]);

    useEffect(() => {
        processAnimated(disabled ? 'disabled' : state);
    }, [disabled, processAnimated, state]);

    useEffect(() => {
        !disabled && processAnimated(error ? 'error' : state);
    }, [disabled, error, processAnimated, state]);

    return {
        activeIndicatorColor,
        activeIndicatorHeight,
        backgroundColor,
        inputColor,
        inputHeight,
        labelColor,
        labelLineHeight,
        labelLineLetterSpacing,
        labelSize,
        onAnimated: processAnimated,
        supportingTextColor,
        supportingTextOpacity,
        ...(type === 'outlined' && {
            borderColor,
            borderWidth,
            labelLeft,
            labelTextBackgroundWidth,
            labelTop,
        }),
    };
};
