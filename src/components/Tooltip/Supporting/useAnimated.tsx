import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../../utils/animatedTiming.utils';
import {RenderProps} from './SupportingBase';

interface UseAnimatedOptions extends Pick<RenderProps, 'visible'> {
    onClosed: (value?: boolean) => void;
}

interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    opacityAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {opacityAnimated, visible, onClosed}: ProcessAnimatedTimingOptions,
) =>
    requestAnimationFrame(() =>
        animatedTiming(opacityAnimated, {toValue: visible ? 1 : 0}).start(() => onClosed(visible)),
    );

export const useAnimated = ({visible, onClosed}: UseAnimatedOptions) => {
    const [opacityAnimated] = useAnimatedValue(visible ? 1 : 0);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);
    const opacity = opacityAnimated.interpolate({inputRange: [0, 1], outputRange: [0, 1]});

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {opacityAnimated, visible, onClosed});
    }, [animatedTiming, onClosed, opacityAnimated, visible]);

    return [{opacity}];
};
