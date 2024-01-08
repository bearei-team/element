import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {UTIL} from '../../../utils/util';
import {EventName} from '../../Common/interface';
import {RenderProps} from './ListItemBase';

export interface UseAnimatedOptions extends Pick<RenderProps, 'close'> {
    eventName: EventName;
    trailingEventName: EventName;
}

export interface ProcessAnimatedTimingOptions {
    toValue: number;
    finished?: () => void;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {close, eventName, trailingEventName} = options;
    const [closedAnimated] = useAnimatedValue(1);
    const [trailingOpacityAnimated] = useAnimatedValue(close ? 0 : 1);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const trailingOpacity = trailingOpacityAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const scale = closedAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const processAnimatedTiming = useCallback(
        (
            animation: Animated.Value,
            processAnimatedTimingOptions: ProcessAnimatedTimingOptions,
        ) => {
            const {toValue, finished} = processAnimatedTimingOptions;

            requestAnimationFrame(() =>
                animatedTiming(animation, {
                    duration: 'short3',
                    easing: 'standard',
                    toValue,
                    useNativeDriver: true,
                }).start(finished),
            );
        },
        [animatedTiming],
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
        const closeToValue = [eventName, trailingEventName].includes('hoverIn')
            ? 1
            : 0;

        processAnimatedTiming(trailingOpacityAnimated, {
            toValue: close ? closeToValue : 1,
        });
    }, [
        close,
        eventName,
        processAnimatedTiming,
        trailingEventName,
        trailingOpacityAnimated,
    ]);

    return {
        onCloseAnimated: processCloseAnimated,
        scale,
        trailingOpacity,
    };
};
