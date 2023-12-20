import {useCallback, useEffect} from 'react';
import {Animated, LayoutRectangle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {AnimatedTimingOptions} from '../../utils/animatedTiming.utils';
import {UTIL} from '../../utils/util';
import {Data} from './TabBase';

export interface UseAnimatedOptions {
    data: Data[];
    headerVisible: boolean;
    itemLayout: LayoutRectangle;
    layout: LayoutRectangle;
}

export interface ProcessAnimatedTimingOptions extends AnimatedTimingOptions {
    toValue: number;
    finished?: () => void;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {data, itemLayout, layout, headerVisible} = options;
    const {width: layoutWidth = 0} = layout;
    const {height: itemLayoutHeight = 0, width: itemLayoutWidth = 0} =
        itemLayout;

    const dataIndexes = Array.from({length: data.length}, (_, index) => index);
    const defaultRange = dataIndexes.length === 0 ? [0, 1] : dataIndexes;
    const draftActiveIndicatorWidth =
        data.find(({active}) => active)?.labelTextLayout.width ?? 0;

    const [headerAnimated] = useAnimatedValue(1);
    const [activeAnimated] = useAnimatedValue(0);
    const [activeIndicatorWidthAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const headerHeight = headerAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            0,
            !itemLayoutHeight
                ? theme.adaptSize(theme.spacing.small * 6)
                : itemLayoutHeight,
        ],
    });

    const activeIndicatorLeft = activeAnimated.interpolate({
        inputRange: defaultRange,
        outputRange:
            dataIndexes.length === 0
                ? defaultRange
                : dataIndexes.map(index => index * itemLayoutWidth),
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
        outputRange: [
            draftActiveIndicatorWidth,
            draftActiveIndicatorWidth * 1.2,
        ],
    });

    const processAnimatedTiming = useCallback(
        (
            animation: Animated.Value,
            processAnimatedTimingOptions: ProcessAnimatedTimingOptions,
        ) => {
            const {toValue, finished, duration, easing} =
                processAnimatedTimingOptions;

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
    }, [
        activeAnimated,
        activeIndicatorWidthAnimated,
        data,
        processAnimatedTiming,
    ]);

    useEffect(() => {
        processAnimatedTiming(headerAnimated, {
            toValue: headerVisible ? 1 : 0,
            duration: 'short3',
            easing: 'standard',
        });
    }, [headerAnimated, headerVisible, processAnimatedTiming]);

    return {
        activeIndicatorLeft,
        activeIndicatorWidth,
        contentInnerLeft,
        headerHeight,
    };
};
