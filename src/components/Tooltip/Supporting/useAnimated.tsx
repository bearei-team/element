import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../../utils/animatedTiming.utils';
import {RenderProps} from './SupportingBase';

export type UseAnimatedOptions = Pick<RenderProps, 'visible' | 'defaultVisible'>;
export interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    opacityAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {opacityAnimated, visible}: ProcessAnimatedTimingOptions,
) =>
    requestAnimationFrame(() =>
        animatedTiming(opacityAnimated, {toValue: visible ? 1 : 0}).start(),
    );

export const useAnimated = ({visible, defaultVisible}: UseAnimatedOptions) => {
    const [opacityAnimated] = useAnimatedValue(defaultVisible ? 1 : 0);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);
    const opacity = opacityAnimated.interpolate({inputRange: [0, 1], outputRange: [0, 1]});

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {opacityAnimated, visible});
    }, [animatedTiming, opacityAnimated, visible]);

    return [{opacity}];
};
