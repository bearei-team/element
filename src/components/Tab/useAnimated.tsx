import {useEffect} from 'react';
import {Animated, LayoutRectangle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater} from 'use-immer';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../utils/animatedTiming.utils';
import {InitialState, TabDataSource} from './TabBase';

interface UseAnimatedOptions {
    activeIndicatorBaseWidth: number;
    activeKey?: string;
    data?: TabDataSource[];
    defaultActiveKey?: string;
    itemLayout: LayoutRectangle;
    layout: LayoutRectangle;
    setState: Updater<InitialState>;
}

interface ProcessAnimatedTimingOptions
    extends Pick<UseAnimatedOptions, 'data' | 'activeKey' | 'setState'> {
    activeAnimated: Animated.Value;
    activeIndicatorWidthAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {
        data = [],
        activeKey,
        activeAnimated,
        activeIndicatorWidthAnimated,
        setState,
    }: ProcessAnimatedTimingOptions,
) => {
    const index = data.findIndex(({key}) => key === activeKey);
    const toValue = index === -1 ? 0 : index;

    typeof activeKey === 'string' &&
        setState(draft => {
            draft.status === 'succeeded' &&
                requestAnimationFrame(() =>
                    Animated.parallel([
                        animatedTiming(activeAnimated, {
                            toValue,
                            duration: 'medium3',
                            easing: 'emphasizedDecelerate',
                        }),
                        animatedTiming(activeIndicatorWidthAnimated, {toValue}),
                    ]).start(() =>
                        requestAnimationFrame(() =>
                            animatedTiming(activeIndicatorWidthAnimated, {toValue: 0}).start(),
                        ),
                    ),
                );
        });
};

export const useAnimated = ({
    activeIndicatorBaseWidth,
    activeKey,
    data = [],
    defaultActiveKey,
    itemLayout,
    layout,
    setState,
}: UseAnimatedOptions) => {
    const {width: layoutWidth = 0} = layout;
    const {width: itemLayoutWidth = 0} = itemLayout;
    const defaultActiveIndex = data.findIndex(({key}) => key === defaultActiveKey);
    const defaultValue = defaultActiveIndex === -1 ? 0 : defaultActiveIndex;
    const dataIndexes = Array.from({length: data.length}, (_, index) => index);
    const defaultRange = dataIndexes.length <= 1;
    const range = defaultRange ? [0, 1] : dataIndexes;
    const [activeAnimated] = useAnimatedValue(defaultValue);
    const [activeIndicatorWidthAnimated] = useAnimatedValue(defaultValue);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);

    console.info(range);
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
        console.info(activeKey, 'activeKeADMIy');
        processAnimatedTiming(animatedTiming, {
            activeAnimated,
            activeIndicatorWidthAnimated,
            activeKey,
            data,
            setState,
        });
    }, [activeAnimated, activeIndicatorWidthAnimated, activeKey, animatedTiming, data, setState]);

    return [{activeIndicatorLeft, activeIndicatorWidth, contentInnerLeft}];
};
