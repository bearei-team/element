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

type UseAnimatedOptions = Pick<RenderProps, 'visible' | 'position' | 'onClosed' | 'type'>;
interface ScreenAnimatedOptions extends Pick<UseAnimatedOptions, 'onClosed'> {
    backgroundAnimated: Animated.Value;
    translateXAnimated: Animated.Value;
    widthAnimated: Animated.Value;
}

type ProcessAnimatedTimingOptions = ScreenAnimatedOptions & Pick<UseAnimatedOptions, 'visible'>;

const enterScreen = (
    animatedTiming: AnimatedTiming,
    {backgroundAnimated, translateXAnimated, widthAnimated}: ScreenAnimatedOptions,
) => {
    const animatedTimingOptions = {
        duration: 'medium3',
        easing: 'emphasizedDecelerate',
        toValue: 1,
    } as AnimatedTimingOptions;

    Animated.parallel([
        animatedTiming(backgroundAnimated, animatedTimingOptions),
        animatedTiming(translateXAnimated, animatedTimingOptions),
        animatedTiming(widthAnimated, animatedTimingOptions),
    ]).start();
};

const exitScreen = (
    animatedTiming: AnimatedTiming,
    {backgroundAnimated, translateXAnimated, onClosed, widthAnimated}: ScreenAnimatedOptions,
) => {
    const animatedTimingOptions = {
        duration: 'short3',
        easing: 'emphasizedAccelerate',
        toValue: 0,
    } as AnimatedTimingOptions;
    Animated.parallel([
        animatedTiming(backgroundAnimated, animatedTimingOptions),
        animatedTiming(translateXAnimated, animatedTimingOptions),
        animatedTiming(widthAnimated, animatedTimingOptions),
    ]).start(() => onClosed?.());
};

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {
        backgroundAnimated,
        onClosed,
        translateXAnimated,
        visible,
        widthAnimated,
    }: ProcessAnimatedTimingOptions,
) => {
    const screenAnimatedOptions = {backgroundAnimated, translateXAnimated, widthAnimated};

    visible
        ? enterScreen(animatedTiming, screenAnimatedOptions)
        : exitScreen(animatedTiming, {...screenAnimatedOptions, onClosed});
};

export const useAnimated = ({visible, position, type, onClosed}: UseAnimatedOptions) => {
    const animatedValue = visible ? 1 : 0;
    const [backgroundAnimated] = useAnimatedValue(animatedValue);
    const [translateXAnimated] = useAnimatedValue(animatedValue);
    const [widthAnimated] = useAnimatedValue(animatedValue);
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

    const width = widthAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.adaptSize(theme.spacing.small * 0),
            theme.adaptSize(theme.spacing.small * 40),
        ],
    });

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {
            backgroundAnimated,
            translateXAnimated,
            visible,
            onClosed,
            widthAnimated,
        });

        return () => {
            backgroundAnimated.stopAnimation();
            translateXAnimated.stopAnimation();
            widthAnimated.stopAnimation();
        };
    }, [animatedTiming, backgroundAnimated, onClosed, translateXAnimated, visible, widthAnimated]);

    return [{backgroundColor, innerTranslateX, width}];
};
