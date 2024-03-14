import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {
    AnimatedTiming,
    AnimatedTimingOptions,
    createAnimatedTiming,
} from '../../../utils/animatedTiming.utils';
import {RenderProps} from './SheetBase';

type UseAnimatedOptions = Pick<RenderProps, 'visible' | 'position' | 'type'>;
interface ScreenAnimatedOptions {
    backgroundAnimated: Animated.Value;
    translateXAnimated: Animated.Value;
}

type ProcessAnimatedTimingOptions = ScreenAnimatedOptions & Pick<UseAnimatedOptions, 'visible'>;

const enterScreen = (
    animatedTiming: AnimatedTiming,
    {backgroundAnimated, translateXAnimated}: ScreenAnimatedOptions,
) => {
    const animatedTimingOptions = {
        duration: 'medium3',
        easing: 'emphasizedDecelerate',
        toValue: 1,
    } as AnimatedTimingOptions;

    requestAnimationFrame(() => {
        Animated.parallel([
            animatedTiming(backgroundAnimated, animatedTimingOptions),
            animatedTiming(translateXAnimated, animatedTimingOptions),
        ]).start();
    });
};

const exitScreen = (
    animatedTiming: AnimatedTiming,
    {backgroundAnimated, translateXAnimated}: ScreenAnimatedOptions,
) => {
    const animatedTimingOptions = {
        duration: 'short3',
        easing: 'emphasizedAccelerate',
        toValue: 0,
    } as AnimatedTimingOptions;

    requestAnimationFrame(() => {
        Animated.parallel([
            animatedTiming(backgroundAnimated, animatedTimingOptions),
            animatedTiming(translateXAnimated, animatedTimingOptions),
        ]).start();
    });
};

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {backgroundAnimated, translateXAnimated, visible}: ProcessAnimatedTimingOptions,
) => {
    const screenAnimatedOptions = {backgroundAnimated, translateXAnimated};

    visible
        ? enterScreen(animatedTiming, screenAnimatedOptions)
        : exitScreen(animatedTiming, screenAnimatedOptions);
};

export const useAnimated = ({visible, position, type}: UseAnimatedOptions) => {
    const animatedValue = visible ? 1 : 0;
    const [backgroundAnimated] = useAnimatedValue(animatedValue);
    const [translateXAnimated] = useAnimatedValue(animatedValue);
    const [] = useAnimatedValue(animatedValue);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);
    const backgroundColor = backgroundAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.color.convertHexToRGBA(theme.palette.scrim.scrim, 0),
            type === 'standard'
                ? theme.color.convertHexToRGBA(theme.palette.scrim.scrim, 0)
                : theme.color.convertHexToRGBA(theme.palette.scrim.scrim, 0.32),
        ],
    });

    const innerTranslateX = translateXAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            position === 'horizontalEnd'
                ? theme.adaptSize(theme.spacing.small * 40)
                : -theme.adaptSize(theme.spacing.small * 40),
            theme.adaptSize(theme.spacing.none),
        ],
    });

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {
            backgroundAnimated,
            translateXAnimated,
            visible,
        });
    }, [animatedTiming, backgroundAnimated, translateXAnimated, visible]);

    return [{backgroundColor, innerTranslateX}];
};
