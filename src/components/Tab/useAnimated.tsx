import {useCallback, useEffect} from 'react';
import {Animated, LayoutRectangle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {AnimatedTimingOptions} from '../../utils/animatedTiming.utils';
import {UTIL} from '../../utils/util';
import {Data} from './TabBase';

export interface UseAnimatedOptions {
    itemLayout: Pick<LayoutRectangle, 'height' | 'width'>;
    layout: Pick<LayoutRectangle, 'height' | 'width'>;
    data: Data[];
    headerVisible: boolean;
}

export interface ProcessAnimatedTimingOptions extends AnimatedTimingOptions {
    toValue: number;
    finished?: () => void;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {data, itemLayout, layout, headerVisible} = options;
    const dataIndexes = Array.from({length: data.length}, (_, index) => index);
    const defaultRange = dataIndexes.length === 0 ? [0, 1] : dataIndexes;
    const draftActiveIndicatorWidth = data.find(({active}) => active)?.labelTextLayout.width ?? 0;
    const [headerAnimated] = useAnimatedValue(1);
    const [activeAnimated] = useAnimatedValue(0);
    const [activeIndicatorWidthAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const headerHeight = headerAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, itemLayout.height],
    });

    const activeIndicatorLeft = activeAnimated.interpolate({
        inputRange: defaultRange,
        outputRange:
            dataIndexes.length === 0
                ? defaultRange
                : dataIndexes.map(index => index * (itemLayout.width ?? 0)),
    });

    const contentInnerLeft = activeAnimated.interpolate({
        inputRange: defaultRange,
        outputRange:
            dataIndexes.length === 0
                ? defaultRange
                : dataIndexes.map(index => -(index * (layout.width ?? 0))),
    });

    const activeIndicatorWidth = activeIndicatorWidthAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [draftActiveIndicatorWidth, draftActiveIndicatorWidth * 1.5],
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

        console.info(index);

        processAnimatedTiming(activeIndicatorWidthAnimated, {
            duration: 'short3',
            easing: 'standard',
            toValue: index === -1 ? 0 : index,
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

    useEffect(() => {
        processAnimatedTiming(headerAnimated, {
            toValue: headerVisible ? 1 : 0,
            duration: 'short3',
            easing: 'standard',
        });
    }, [headerAnimated, headerVisible, processAnimatedTiming]);

    return {activeIndicatorLeft, activeIndicatorWidth, contentInnerLeft, headerHeight};
};
