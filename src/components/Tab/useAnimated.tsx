import {useCallback, useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {AnimatedTimingOptions} from '../../utils/animatedTiming.utils';
import {UTIL} from '../../utils/util';
import {Data} from './TabBase';

export interface UseAnimatedOptions {
    itemWidth: number;
    layoutWidth: number;
    data: Data[];
}

export interface ProcessAnimatedTimingOptions extends AnimatedTimingOptions {
    toValue: number;
    finished?: () => void;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {data, itemWidth, layoutWidth} = options;
    const dataIndexes = Array.from({length: data.length}, (_, index) => index);
    const defaultRange = dataIndexes.length === 0 ? [0, 1] : dataIndexes;
    const curActiveIndicatorWidth = data.find(({active}) => active)?.labelTextLayout.width ?? 0;
    const [activeAnimated] = useAnimatedValue(0);
    const [activeIndicatorWidthAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const activeIndicatorLeft = activeAnimated.interpolate({
        inputRange: defaultRange,
        outputRange:
            dataIndexes.length === 0 ? defaultRange : dataIndexes.map(index => index * itemWidth),
    });

    const contentInnerLeft = activeAnimated.interpolate({
        inputRange: defaultRange,
        outputRange:
            dataIndexes.length === 0
                ? defaultRange
                : dataIndexes.map(index => -(index * layoutWidth)),
    });

    const activeIndicatorWidth = activeIndicatorWidthAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [curActiveIndicatorWidth, curActiveIndicatorWidth * 1.5],
    });

    const processAnimatedTiming = useCallback(
        (animation: Animated.Value, processAnimatedTimingOptions: ProcessAnimatedTimingOptions) => {
            const {toValue, finished, duration, easing} = processAnimatedTimingOptions;
            const animatedTiming = UTIL.animatedTiming(theme);

            requestAnimationFrame(() =>
                animatedTiming(animation, {
                    duration,
                    easing,
                    toValue,
                }).start(finished),
            );
        },
        [theme],
    );

    useEffect(() => {
        const index = data.findIndex(({active}) => active);
        processAnimatedTiming(activeIndicatorWidthAnimated, {
            duration: 'short3',
            easing: 'standard',
            toValue: 1,
            finished: () =>
                processAnimatedTiming(activeIndicatorWidthAnimated, {
                    toValue: 0,
                    duration: 'short3',
                    easing: 'standard',
                }),
        });

        processAnimatedTiming(activeAnimated, {
            toValue: index === -1 ? 0 : index,
            duration: 'medium3',
            easing: 'emphasizedDecelerate',
        });
    }, [activeAnimated, activeIndicatorWidthAnimated, data, processAnimatedTiming]);

    return {activeIndicatorLeft, activeIndicatorWidth, contentInnerLeft};
};
