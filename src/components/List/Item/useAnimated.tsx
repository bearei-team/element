import {useCallback, useEffect} from 'react';
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
}

export interface ProcessAnimatedTimingOptions {
    toValue: number;
    finished?: () => void;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {active, close, state, touchableRippleHeight, trailingState} = options;
    const [stateAnimated] = useAnimatedValue(0);
    const [trailingAnimated] = useAnimatedValue(0);
    const [closedAnimated] = useAnimatedValue(1);
    const theme = useTheme();
    const backgroundColor = stateAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.color.rgba(theme.palette.secondary.secondaryContainer, 0),
            theme.palette.secondary.secondaryContainer,
        ],
    });

    const trailingOpacity = trailingAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [close ? 0 : 1, 1],
    });

    const height = closedAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, touchableRippleHeight],
    });

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
        processAnimatedTiming(stateAnimated, {toValue: active ? 1 : 0});
    }, [active, processAnimatedTiming, stateAnimated]);

    useEffect(() => {
        const closeToValue = state === 'hovered' || trailingState === 'hovered' ? 1 : 0;
        const toValue = trailingState === 'hovered' ? 1 : 0;

        processAnimatedTiming(trailingAnimated, {
            toValue: close ? closeToValue : toValue,
        });
    }, [close, processAnimatedTiming, state, trailingAnimated, trailingState]);

    return {
        backgroundColor,
        height,
        onCloseAnimated: processCloseAnimated,
        trailingOpacity,
    };
};
