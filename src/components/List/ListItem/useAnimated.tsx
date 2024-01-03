import {useCallback, useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {UTIL} from '../../../utils/util';
import {State} from '../../Common/interface';

export interface UseAnimatedOptions {
    active: boolean;
    close: boolean;
    state: State;
    trailingState: State;
    touchableRippleHeight: number;
    rippleAnimatedEnd: boolean;
}

export interface ProcessAnimatedTimingOptions {
    toValue: number;
    finished?: () => void;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {active, close, state, touchableRippleHeight, trailingState} =
        options;

    const [trailingOpacityAnimated] = useAnimatedValue(0);
    const [closedAnimated] = useAnimatedValue(1);
    const theme = useTheme();

    const trailingOpacity = trailingOpacityAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [close ? 0 : 1, 1],
    });

    const height = useMemo(
        () =>
            closedAnimated.interpolate({
                inputRange: [0, 1],
                outputRange: [0, touchableRippleHeight],
            }),
        [closedAnimated, touchableRippleHeight],
    );

    const processAnimatedTiming = useCallback(
        (
            animation: Animated.Value,
            processAnimatedTimingOptions: ProcessAnimatedTimingOptions,
        ) => {
            const {toValue, finished} = processAnimatedTimingOptions;
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

    const processCloseAnimated = useCallback(
        (finished?: () => void) => {
            processAnimatedTiming(closedAnimated, {
                finished,
                toValue: 0,
            });
        },
        [closedAnimated, processAnimatedTiming],
    );

    useEffect(() => {
        const closeOut = state !== 'enabled' ? 1 : 0;
        const closeToValue =
            state === 'hovered' || trailingState === 'hovered' ? 1 : closeOut;

        const toValue = trailingState === 'hovered' ? 1 : 0;

        processAnimatedTiming(trailingOpacityAnimated, {
            toValue: close ? closeToValue : toValue,
        });
    }, [
        close,
        processAnimatedTiming,
        state,
        trailingOpacityAnimated,
        trailingState,
    ]);

    return {
        height,
        onCloseAnimated: processCloseAnimated,
        trailingOpacity,
    };
};
