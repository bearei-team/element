import {useEffect} from 'react';
import {Animated, LayoutRectangle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../utils/animatedTiming.utils';
import {Data} from './TabBase';

export interface UseAnimatedOptions {
    data: Data;
    itemLayout: LayoutRectangle;
    layout: LayoutRectangle;
    activeKey?: string;
    activeIndicatorBaseWidth: number;
}

export interface ProcessAnimatedTimingOptions
    extends Pick<UseAnimatedOptions, 'data' | 'activeKey'> {
    activeAnimated: Animated.Value;
    activeIndicatorWidthAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {data, activeKey, activeAnimated, activeIndicatorWidthAnimated}: ProcessAnimatedTimingOptions,
) => {
    const index = data.findIndex(({key}) => key === activeKey);
    const toValue = index === -1 ? 0 : index;

    requestAnimationFrame(() =>
        animatedTiming(activeAnimated, {
            toValue,
            duration: 'medium3',
            easing: 'emphasizedDecelerate',
        }).start(),
    );

    requestAnimationFrame(() =>
        animatedTiming(activeIndicatorWidthAnimated, {toValue}).start(() =>
            requestAnimationFrame(() =>
                animatedTiming(activeIndicatorWidthAnimated, {toValue: 0}).start(),
            ),
        ),
    );
};

export const useAnimated = ({
    data,
    itemLayout,
    layout,
    activeKey,
    activeIndicatorBaseWidth,
}: UseAnimatedOptions) => {
    const {width: layoutWidth = 0} = layout;
    const {width: itemLayoutWidth = 0} = itemLayout;
    const dataIndexes = Array.from({length: data.length}, (_, index) => index);
    const defaultRange = dataIndexes.length <= 1;
    const range = defaultRange ? [0, 1] : dataIndexes;
    const [activeAnimated] = useAnimatedValue(0);
    const [activeIndicatorWidthAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);
    const activeIndicatorLeft = activeAnimated.interpolate({
        inputRange: range,
        outputRange: defaultRange ? range : dataIndexes.map(index => index * itemLayoutWidth),
    });

    const contentInnerLeft = activeAnimated.interpolate({
        inputRange: range,
        outputRange: defaultRange ? range : dataIndexes.map(index => -(index * layoutWidth)),
    });

    const activeIndicatorWidth = activeIndicatorWidthAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [activeIndicatorBaseWidth, activeIndicatorBaseWidth * 1.3],
    });

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {
            activeAnimated,
            activeIndicatorWidthAnimated,
            activeKey,
            data,
        });
    }, [activeAnimated, activeIndicatorWidthAnimated, activeKey, animatedTiming, data]);

    return [{activeIndicatorLeft, activeIndicatorWidth, contentInnerLeft}];
};
