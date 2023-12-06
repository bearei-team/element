import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {UTIL} from '../../../utils/util';
import {ListItemState} from './Item';

export interface UseAnimatedOptions {
    active: boolean;
    close: boolean;
    state: ListItemState;
}

export interface ProcessAnimatedTimingOptions {
    toValue: number;
    finished?: () => void;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {active, close, state} = options;
    const [stateAnimated] = useAnimatedValue(0);
    const [hoveredAnimated] = useAnimatedValue(0);
    const [closedAnimated] = useAnimatedValue(1);
    const theme = useTheme();
    const backgroundColor = stateAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.color.rgba(theme.palette.secondary.secondaryContainer, 0),
            theme.palette.secondary.secondaryContainer,
        ],
    });

    const trailingOpacity = hoveredAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [close ? 0 : 1, 1],
    });

    const height = closedAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, theme.adaptSize(56)],
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
        processAnimatedTiming(hoveredAnimated, {
            toValue: ['hovered', 'trailingHovered'].includes(state) ? 1 : 0,
        });
    }, [hoveredAnimated, processAnimatedTiming, state]);

    return {
        backgroundColor,
        height,
        onCloseAnimated: processCloseAnimated,
        trailingOpacity,
    };
};
