import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../../utils/animatedTiming.utils';
import {RenderProps} from './SupportingBase';

interface UseAnimatedOptions extends Pick<RenderProps, 'visible'> {
    onVisible: (value?: boolean) => void;
}

interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    opacityAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {opacityAnimated, visible, onVisible}: ProcessAnimatedTimingOptions,
) =>
    requestAnimationFrame(() =>
        animatedTiming(opacityAnimated, {toValue: visible ? 1 : 0}).start(
            () => !visible && onVisible(visible),
        ),
    );

export const useAnimated = ({visible, onVisible}: UseAnimatedOptions) => {
    const [opacityAnimated] = useAnimatedValue(visible ? 1 : 0);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);
    const opacity = opacityAnimated.interpolate({inputRange: [0, 1], outputRange: [0, 1]});

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {opacityAnimated, visible, onVisible});
    }, [animatedTiming, onVisible, opacityAnimated, visible]);

    return [{opacity}];
};
