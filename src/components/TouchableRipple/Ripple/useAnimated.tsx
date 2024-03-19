import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {
    AnimatedTiming,
    AnimatedTimingOptions,
    useAnimatedTiming,
} from '../../../hooks/useAnimatedTiming';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {RenderProps} from './RippleBase';

interface UseAnimatedOptions extends Pick<RenderProps, 'onEntryAnimatedFinished' | 'active'> {
    minDuration: number;
    sequence: string;
}

interface CreateEntryAnimatedOptions extends Pick<UseAnimatedOptions, 'minDuration' | 'active'> {
    opacityAnimated: Animated.Value;
    scaleAnimated: Animated.Value;
}

type CreateExitAnimatedOptions = Omit<CreateEntryAnimatedOptions, 'minDuration'>;
type ProcessAnimatedTimingOptions = CreateEntryAnimatedOptions &
    CreateExitAnimatedOptions &
    Pick<UseAnimatedOptions, 'onEntryAnimatedFinished' | 'sequence'>;

const createEntryAnimated =
    (
        animatedTiming: AnimatedTiming,
        {active, scaleAnimated, minDuration, opacityAnimated}: CreateEntryAnimatedOptions,
    ) =>
    (finished?: () => void) => {
        const animatedTimingOptions = {
            duration: Math.min(minDuration, 400),
            easing: 'emphasizedDecelerate',
            toValue: 1,
        } as AnimatedTimingOptions;

        if (typeof active === 'boolean') {
            return Animated.parallel([
                animatedTiming(scaleAnimated, animatedTimingOptions),
                animatedTiming(opacityAnimated, animatedTimingOptions),
            ]).start(finished);
        }

        animatedTiming(scaleAnimated, animatedTimingOptions).start(finished);
    };

const createExitAnimated =
    (
        animatedTiming: AnimatedTiming,
        {active, opacityAnimated, scaleAnimated}: CreateExitAnimatedOptions,
    ) =>
    (finished?: () => void) => {
        const animatedTimingOptions = {
            duration: 'short3',
            easing: 'emphasizedAccelerate',
            toValue: 0,
        } as AnimatedTimingOptions;

        if (typeof active === 'boolean') {
            return Animated.parallel([
                animatedTiming(scaleAnimated, animatedTimingOptions),
                animatedTiming(opacityAnimated, animatedTimingOptions),
            ]).start(finished);
        }

        animatedTiming(opacityAnimated, animatedTimingOptions).start(finished);
    };

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {
        active,
        minDuration,
        onEntryAnimatedFinished,
        opacityAnimated,
        scaleAnimated,
        sequence,
    }: ProcessAnimatedTimingOptions,
) => {
    const entryAnimated = createEntryAnimated(animatedTiming, {
        active,
        minDuration,
        opacityAnimated,
        scaleAnimated,
    });

    const exitAnimated = createExitAnimated(animatedTiming, {
        active,
        opacityAnimated,
        scaleAnimated,
    });

    if (typeof active === 'boolean') {
        return active ? entryAnimated() : exitAnimated();
    }

    entryAnimated(() => onEntryAnimatedFinished?.(sequence, exitAnimated));
};

export const useAnimated = ({
    active,
    minDuration,
    onEntryAnimatedFinished,
    sequence,
}: UseAnimatedOptions) => {
    const [opacityAnimated] = useAnimatedValue(1);
    const [scaleAnimated] = useAnimatedValue(active ? 1 : 0);
    const theme = useTheme();
    const [animatedTiming] = useAnimatedTiming(theme);
    const opacity = opacityAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const scale = scaleAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {
            active,
            minDuration,
            onEntryAnimatedFinished,
            opacityAnimated,
            scaleAnimated,
            sequence,
        });

        return () => {
            opacityAnimated.stopAnimation();
            scaleAnimated.stopAnimation();
        };
    }, [
        active,
        animatedTiming,
        minDuration,
        onEntryAnimatedFinished,
        opacityAnimated,
        scaleAnimated,
        sequence,
    ]);

    return [{opacity, scale}];
};
