import {useCallback, useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {State} from '../Common/interface';
import {TextFieldType} from './TextField';
import {ProcessStateOptions} from './TextFieldBase';

export interface ProcessAnimatedTimingOptions {
    toValue: number;
    finished?: () => void;
}

export type ProcessAnimatedOptions = ProcessStateOptions &
    Pick<ProcessAnimatedTimingOptions, 'finished'> & {input?: boolean};

export interface UseAnimatedOptions {
    filled: boolean;
    labelTextWidth: number;
    showLeadingIcon: boolean;
    showSupportingText: boolean;
    type: TextFieldType;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {filled, labelTextWidth, showLeadingIcon, showSupportingText, type} = options;
    const [activeIndicatorAnimated] = useAnimatedValue(0);
    const [borderAnimated] = useAnimatedValue(0);
    const [backgroundColorAnimated] = useAnimatedValue(1);
    const [colorAnimated] = useAnimatedValue(1);
    const filledValue = filled ? 1 : 0;
    const [inputAnimated] = useAnimatedValue(filledValue);
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
            inputAnimated.interpolate({inputRange: [0, 1], outputRange: [0, theme.adaptSize(24)]}),
        [inputAnimated, theme],
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
        (processStateAnimatedOptions: ProcessAnimatedOptions) => {
            const {input, finished} = processStateAnimatedOptions;

            return {
                disabled: () => {
                    const toValue = 0;

                    processBorderAnimated(toValue);
                    processAnimatedTiming(colorAnimated, {toValue});
                    processAnimatedTiming(supportingTextColorAnimated, {toValue});
                    processAnimatedTiming(backgroundColorAnimated, {toValue});
                },
                enabled: () => {
                    const runInputAnimated = () => {
                        const toValue = filled ? 1 : 0;

                        processBorderAnimated(0);
                        processAnimatedTiming(colorAnimated, {toValue: 1});
                        processAnimatedTiming(inputAnimated, {toValue});
                        processAnimatedTiming(labeAnimated, {toValue});
                        processAnimatedTiming(labelPlaceholderAnimated, {toValue});
                    };

                    input && runInputAnimated();

                    processAnimatedTiming(supportingTextColorAnimated, {toValue: 1});
                },
                error: () => {
                    processAnimatedTiming(supportingTextColorAnimated, {toValue: 2});
                    processAnimatedTiming(colorAnimated, {toValue: 3});
                },
                focused: () => {
                    const runInputAnimated = () => {
                        processBorderAnimated(1);
                        processAnimatedTiming(labelPlaceholderAnimated, {toValue: 1});
                        processAnimatedTiming(colorAnimated, {toValue: 2});
                    };

                    input && runInputAnimated();
                },
                hovered: undefined,
                pressed: () => {
                    const toValue = 1;

                    processAnimatedTiming(inputAnimated, {toValue});
                    processAnimatedTiming(labeAnimated, {toValue, finished});
                },
            };
        },
        [
            backgroundColorAnimated,
            colorAnimated,
            filled,
            inputAnimated,
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
