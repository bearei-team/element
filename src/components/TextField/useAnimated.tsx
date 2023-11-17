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

export interface UseAnimatedOptions extends Pick<TextFieldProps, 'supportingText'> {
    filled: boolean;
}

export const useAnimated = ({filled, supportingText}: UseAnimatedOptions) => {
    const [activeIndicatorAnimated] = useAnimatedValue(0);
    const [backgroundColorAnimated] = useAnimatedValue(1);
    const [colorAnimated] = useAnimatedValue(1);
    const filledValue = filled ? 1 : 0;
    const [inputAnimated] = useAnimatedValue(filledValue);
    const [labeAnimated] = useAnimatedValue(filledValue);
    const [supportingTextColorAnimated] = useAnimatedValue(1);
    const [supportingTextColorOpacity] = useAnimatedValue(0);

    const theme = useTheme();
    const disabledColor = theme.color.rgba(theme.palette.surface.onSurface, 0.38);
    const disabledBackgroundColor = theme.color.rgba(theme.palette.surface.onSurface, 0.12);

    const inputHeight = inputAnimated.interpolate({inputRange: [0, 1], outputRange: [0, 24]});
    const labelSize = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.typography.body.large.size, theme.typography.body.small.size],
    });

    const labelLineHeight = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.typography.body.large.lineHeight,
            theme.typography.label.small.lineHeight,
        ],
    });

    const labelLineLetterSpacing = labeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.typography.body.large.letterSpacing,
            theme.typography.body.small.letterSpacing,
        ],
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

    const backgroundColor = backgroundColorAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [disabledBackgroundColor, theme.palette.surface.surfaceContainerHighest],
    });

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
            const stateAnimated = {
                disabled: () => {
                    processAnimatedTiming(0, {animatedValue: activeIndicatorAnimated});
                    processAnimatedTiming(0, {animatedValue: colorAnimated});
                    processAnimatedTiming(0, {animatedValue: supportingTextColorAnimated});
                    processAnimatedTiming(0, {animatedValue: backgroundColorAnimated});
                },
                enabled: () => {
                    if (input) {
                        const toValue = filled ? 1 : 0;

                        processAnimatedTiming(0, {animatedValue: activeIndicatorAnimated});
                        processAnimatedTiming(1, {animatedValue: colorAnimated});
                        processAnimatedTiming(toValue, {animatedValue: inputAnimated});
                        processAnimatedTiming(toValue, {animatedValue: labeAnimated});
                    }

                    processAnimatedTiming(1, {animatedValue: supportingTextColorAnimated});
                },
                error: () => {
                    processAnimatedTiming(1, {animatedValue: activeIndicatorAnimated});
                    processAnimatedTiming(2, {animatedValue: supportingTextColorAnimated});
                    processAnimatedTiming(3, {animatedValue: colorAnimated});
                },
                focused: () => {
                    if (input) {
                        processAnimatedTiming(1, {animatedValue: activeIndicatorAnimated});
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
            colorAnimated,
            filled,
            inputAnimated,
            labeAnimated,
            processAnimatedTiming,
            supportingTextColorAnimated,
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
    };
};
