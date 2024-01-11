import {useEffect} from 'react';
import {LayoutRectangle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {Data} from './TabBase';

export interface UseAnimatedOptions {
    data: Data;
    headerVisible: boolean;
    itemLayout: LayoutRectangle;
    layout: LayoutRectangle;
    activeKey?: string;
    activeIndicatorBaseWidth: number;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {
        data,
        itemLayout,
        layout,
        headerVisible,
        activeKey,
        activeIndicatorBaseWidth,
    } = options;
    const {width: layoutWidth = 0} = layout;
    const {height: itemLayoutHeight = 0, width: itemLayoutWidth = 0} =
        itemLayout;

    const dataIndexes = Array.from({length: data.length}, (_, index) => index);
    const defaultRange = dataIndexes.length <= 1;
    const range = defaultRange ? [0, 1] : dataIndexes;
    const [headerAnimated] = useAnimatedValue(1);
    const [activeAnimated] = useAnimatedValue(0);
    const [activeIndicatorWidthAnimated] = useAnimatedValue(0);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
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
        inputRange: range,
        outputRange: defaultRange
            ? range
            : dataIndexes.map(index => index * itemLayoutWidth),
    });

    const contentInnerLeft = activeAnimated.interpolate({
        inputRange: range,
        outputRange: defaultRange
            ? range
            : dataIndexes.map(index => -(index * layoutWidth)),
    });

    const activeIndicatorWidth = activeIndicatorWidthAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [activeIndicatorBaseWidth, activeIndicatorBaseWidth * 1.3],
    });

    useEffect(() => {
        const index = data.findIndex(({key}) => key === activeKey);
        const toValue = index === -1 ? 0 : index;

        requestAnimationFrame(() => {
            animatedTiming(activeAnimated, {
                toValue,
                duration: 'medium3',
                easing: 'emphasizedDecelerate',
            }).start();
        });

        requestAnimationFrame(() => {
            animatedTiming(activeIndicatorWidthAnimated, {
                duration: 'short3',
                easing: 'standard',
                toValue,
                useNativeDriver: false,
            }).start(() => {
                requestAnimationFrame(() => {
                    animatedTiming(activeIndicatorWidthAnimated, {
                        duration: 'short3',
                        easing: 'standard',
                        toValue: 0,
                        useNativeDriver: false,
                    }).start();
                });
            });
        });
    }, [
        activeAnimated,
        activeIndicatorWidthAnimated,
        data,
        animatedTiming,
        activeKey,
    ]);

    useEffect(() => {
        requestAnimationFrame(() => {
            animatedTiming(headerAnimated, {
                toValue: headerVisible ? 1 : 0,
            });
        });
    }, [headerAnimated, headerVisible, animatedTiming]);

    return {
        activeIndicatorLeft,
        activeIndicatorWidth,
        contentInnerLeft,
        headerHeight,
    };
};
