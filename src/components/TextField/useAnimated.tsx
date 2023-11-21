import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {State} from '../Common/interface';
import {ProcessStateOptions} from './BaseTextField';
import {TextFieldProps} from './TextField';

export interface ProcessAnimatedTimingOptions {
    animatedValue: Animated.Value;
    finished?: () => void;
}

export type ProcessStateAnimatedOptions = ProcessStateOptions &
    Pick<ProcessAnimatedTimingOptions, 'finished'> & {input?: boolean};

export interface UseAnimatedOptions
    extends Pick<TextFieldProps, 'supportingText' | 'type' | 'leadingIcon'> {
    filled: boolean;
    labelPlaceholderWidth: number;
}

export const useAnimated = ({
    filled,
    labelPlaceholderWidth,
    leadingIcon,
    supportingText,
    type = 'filled',
}: UseAnimatedOptions) => {
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

    const inputHeight = inputAnimated.interpolate({inputRange: [0, 1], outputRange: [0, 24]});
    const labelSize = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.typography.body.large.size, theme.typography.body.small.size],
    });

    const labelLineHeight = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.typography.body.large.lineHeight,
            theme.typography.body.small.lineHeight,
        ],
    });

    const labelLineLetterSpacing = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.typography.body.large.letterSpacing,
            theme.typography.body.small.letterSpacing,
        ],
    });

    const labelTop = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [16, -8],
    });

    const labelLeft = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [leadingIcon ? 16 + 48 : 16, 16],
    });

    const LabelPlaceholderFixWidth = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, labelPlaceholderWidth / 2],
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
        outputRange: [1, 2],
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
        outputRange: [1, 2],
    });

    const backgroundColor = backgroundColorAnimated.interpolate(backgroundColorConfig[type]);

    const processAnimatedTiming = useCallback(
        (toValue: number, {animatedValue, finished}: ProcessAnimatedTimingOptions) => {
            const animatedTiming = UTIL.animatedTiming(theme);
            const animated = () =>
                requestAnimationFrame(() =>
                    animatedTiming(animatedValue, {
                        duration: 'short3',
                        easing: 'standard',
                        toValue,
                    }).start(finished),
                );

            animated();
        },
        [theme],
    );

    const processAnimated = useCallback(
        (nextState: State, {input, finished}: ProcessStateAnimatedOptions = {}) => {
            const processBorderAnimated = (toValue: number) =>
                type === 'filled'
                    ? processAnimatedTiming(toValue, {animatedValue: activeIndicatorAnimated})
                    : processAnimatedTiming(toValue, {animatedValue: borderAnimated});

            const stateAnimated = {
                disabled: () => {
                    processBorderAnimated(0);
                    processAnimatedTiming(0, {animatedValue: colorAnimated});
                    processAnimatedTiming(0, {animatedValue: supportingTextColorAnimated});
                    processAnimatedTiming(0, {animatedValue: backgroundColorAnimated});
                },
                enabled: () => {
                    if (input) {
                        const toValue = filled ? 1 : 0;

                        processBorderAnimated(0);
                        processAnimatedTiming(1, {animatedValue: colorAnimated});
                        processAnimatedTiming(toValue, {animatedValue: inputAnimated});
                        processAnimatedTiming(toValue, {animatedValue: labeAnimated});
                        processAnimatedTiming(toValue, {animatedValue: labelPlaceholderAnimated});
                    }

                    processAnimatedTiming(1, {animatedValue: supportingTextColorAnimated});
                },
                error: () => {
                    processBorderAnimated(1);
                    processAnimatedTiming(2, {animatedValue: supportingTextColorAnimated});
                    processAnimatedTiming(3, {animatedValue: colorAnimated});
                },
                focused: () => {
                    if (input) {
                        processBorderAnimated(1);
                        processAnimatedTiming(1, {animatedValue: labelPlaceholderAnimated});
                        processAnimatedTiming(2, {animatedValue: colorAnimated});
                    }
                },
                hovered: undefined,
                pressed: () => {
                    processAnimatedTiming(1, {animatedValue: colorAnimated});
                    processAnimatedTiming(1, {animatedValue: inputAnimated, finished});
                    processAnimatedTiming(1, {animatedValue: labeAnimated});
                },
            };

            stateAnimated[nextState]?.();

            if (nextState !== 'disabled') {
                processAnimatedTiming(1, {animatedValue: backgroundColorAnimated});
            }
        },
        [
            activeIndicatorAnimated,
            backgroundColorAnimated,
            borderAnimated,
            colorAnimated,
            filled,
            inputAnimated,
            labeAnimated,
            labelPlaceholderAnimated,
            processAnimatedTiming,
            supportingTextColorAnimated,
            type,
        ],
    );

    useEffect(() => {
        processAnimatedTiming(supportingText ? 1 : 0, {animatedValue: supportingTextColorOpacity});
    }, [processAnimatedTiming, supportingText, supportingTextColorOpacity]);

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
            LabelPlaceholderFixWidth,
            labelTop,
        }),
    };
};
