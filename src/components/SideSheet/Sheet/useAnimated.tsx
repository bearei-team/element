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

type UseAnimatedOptions = Pick<RenderProps, 'visible' | 'position'>;
interface ScreenAnimatedOptions {
    containerAnimated: Animated.Value;
    innerAnimated: Animated.Value;
}

type ProcessAnimatedTimingOptions = ScreenAnimatedOptions & Pick<UseAnimatedOptions, 'visible'>;

const enterScreen = (
    animatedTiming: AnimatedTiming,
    {containerAnimated, innerAnimated}: ScreenAnimatedOptions,
) => {
    const animatedTimingOptions = {
        duration: 'medium3',
        easing: 'emphasizedDecelerate',
        toValue: 1,
    } as AnimatedTimingOptions;

    requestAnimationFrame(() =>
        Animated.parallel([
            animatedTiming(containerAnimated, animatedTimingOptions),
            animatedTiming(innerAnimated, animatedTimingOptions),
        ]).start(),
    );
};

const exitScreen = (
    animatedTiming: AnimatedTiming,
    {containerAnimated, innerAnimated}: ScreenAnimatedOptions,
) => {
    const animatedTimingOptions = {
        duration: 'short3',
        easing: 'emphasizedAccelerate',
        toValue: 0,
    } as AnimatedTimingOptions;

    requestAnimationFrame(() =>
        Animated.parallel([
            animatedTiming(containerAnimated, animatedTimingOptions),
            animatedTiming(innerAnimated, animatedTimingOptions),
        ]).start(),
    );
};

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {
        containerAnimated,
        innerAnimated,

        visible,
    }: ProcessAnimatedTimingOptions,
) => {
    const screenAnimatedOptions = {containerAnimated, innerAnimated};

    visible
        ? enterScreen(animatedTiming, screenAnimatedOptions)
        : exitScreen(animatedTiming, screenAnimatedOptions);
};

export const useAnimated = ({visible, position}: UseAnimatedOptions) => {
    const animatedValue = visible ? 1 : 0;
    const [containerAnimated] = useAnimatedValue(animatedValue);
    const [innerAnimated] = useAnimatedValue(animatedValue);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);
    const backgroundColor = containerAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.color.convertHexToRGBA(theme.palette.scrim.scrim, 0),
            theme.color.convertHexToRGBA(theme.palette.scrim.scrim, 0.32),
        ],
    });

    const innerTranslateX = innerAnimated.interpolate({
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
            containerAnimated,
            innerAnimated,
            visible,
        });
    }, [animatedTiming, containerAnimated, innerAnimated, visible]);

    return [{backgroundColor, innerTranslateX}];
};
