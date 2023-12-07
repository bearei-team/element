import {useCallback, useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {State} from '../Common/interface';
import {TextFieldType} from './TextField';

export interface ProcessAnimatedTimingOptions {
    toValue: number;
    finished?: () => void;
}

export type ProcessAnimatedOptions = Pick<ProcessAnimatedTimingOptions, 'finished'> & {
    input?: boolean;
};

export interface UseAnimatedOptions {
    filled: boolean;
    labelTextWidth: number;
    showLeadingIcon: boolean;
    showSupportingText: boolean;
    type: TextFieldType;
    error: boolean;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {filled, labelTextWidth, showLeadingIcon, showSupportingText, type, error} = options;
    const [activeIndicatorAnimated] = useAnimatedValue(0);
    const [borderAnimated] = useAnimatedValue(0);
    const [backgroundColorAnimated] = useAnimatedValue(1);
    const [colorAnimated] = useAnimatedValue(1);
    const filledValue = filled ? 1 : 0;
    const [inputHeightAnimated] = useAnimatedValue(filledValue);
    const [inputColorAnimated] = useAnimatedValue(1);
    const [labeAnimated] = useAnimatedValue(filledValue);
    const [labelPlaceholderAnimated] = useAnimatedValue(filledValue);
    const [supportingTextColorAnimated] = useAnimatedValue(1);
    const [supportingTextColorOpacity] = useAnimatedValue(0);
    const theme = useTheme();
    const disabledColor = theme.color.rgba(theme.palette.surface.onSurface, 0.38);
    const disabledBackgroundColor = theme.color.rgba(theme.palette.surface.onSurface, 0.12);
    const backgroundColorConfig = {
        filled: {
            inputRange: [0, 1],
            outputRange: [disabledBackgroundColor, theme.palette.surface.surfaceContainerHighest],
        },
        outlined: {
            inputRange: [0, 1],
            outputRange: [theme.palette.surface.surface, theme.palette.surface.surface],
        },
    };

    const inputHeight = useMemo(
        () =>
            inputHeightAnimated.interpolate({
                inputRange: [0, 1],
                outputRange: [0, theme.adaptSize(24)],
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
            showLeadingIcon
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

    const activeIndicatorHeight = activeIndicatorAnimated.interpolate({
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

    const backgroundColor = backgroundColorAnimated.interpolate(backgroundColorConfig[type]);

    const processAnimatedTiming = useCallback(
        (animation: Animated.Value, {toValue, finished}: ProcessAnimatedTimingOptions) => {
            const animatedTiming = UTIL.animatedTiming(theme);

            requestAnimationFrame(() =>
                animatedTiming(animation, {
                    duration: 'short3',
                    easing: 'standard',
                    toValue,
                }).start(finished),
            );
        },
        [theme],
    );

    const processBorderAnimated = useCallback(
        (toValue: number) =>
            type === 'filled'
                ? processAnimatedTiming(activeIndicatorAnimated, {toValue})
                : processAnimatedTiming(borderAnimated, {toValue}),
        [activeIndicatorAnimated, borderAnimated, processAnimatedTiming, type],
    );

    const processStateAnimated = useCallback(
        (processStateAnimatedOptions = {} as ProcessAnimatedOptions) => {
            const {finished} = processStateAnimatedOptions;
            const processErrorAnimated = () => {
                processAnimatedTiming(colorAnimated, {toValue: 3});
                processAnimatedTiming(supportingTextColorAnimated, {toValue: 2});
                processBorderAnimated(1);
            };

            return {
                disabled: () => {
                    const toValue = 0;

                    processBorderAnimated(toValue);
                    processAnimatedTiming(colorAnimated, {toValue});
                    processAnimatedTiming(supportingTextColorAnimated, {toValue});
                    processAnimatedTiming(backgroundColorAnimated, {toValue});
                    processAnimatedTiming(inputColorAnimated, {toValue});
                },
                enabled: () => {
                    const toValue = filled ? 1 : 0;

                    processAnimatedTiming(inputHeightAnimated, {toValue});
                    processAnimatedTiming(labeAnimated, {toValue});
                    processAnimatedTiming(labelPlaceholderAnimated, {toValue});
                    processAnimatedTiming(inputColorAnimated, {toValue: 1});

                    if (error) {
                        return processErrorAnimated();
                    }

                    processAnimatedTiming(colorAnimated, {toValue: 1});
                    processAnimatedTiming(supportingTextColorAnimated, {toValue: 1});
                    processBorderAnimated(0);
                },
                error: () => {
                    processErrorAnimated();
                },
                focused: () => {
                    processAnimatedTiming(inputHeightAnimated, {toValue: 1});
                    processAnimatedTiming(labeAnimated, {toValue: 1, finished});
                    processAnimatedTiming(labelPlaceholderAnimated, {toValue: 1});

                    if (error) {
                        return processErrorAnimated();
                    }

                    processAnimatedTiming(colorAnimated, {toValue: 2});
                    processBorderAnimated(1);
                },
                hovered: undefined,
                pressIn: undefined,
                longPressIn: undefined,
                pressed: undefined,
            };
        },
        [
            backgroundColorAnimated,
            colorAnimated,
            error,
            filled,
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
        (nextState: State, processAnimatedOptions: ProcessAnimatedOptions = {}) => {
            processStateAnimated(processAnimatedOptions)[nextState]?.();

            nextState !== 'disabled' &&
                processAnimatedTiming(backgroundColorAnimated, {toValue: 1});
        },
        [backgroundColorAnimated, processAnimatedTiming, processStateAnimated],
    );

    useEffect(() => {
        processAnimatedTiming(supportingTextColorOpacity, {toValue: showSupportingText ? 1 : 0});
    }, [processAnimatedTiming, showSupportingText, supportingTextColorOpacity]);

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
