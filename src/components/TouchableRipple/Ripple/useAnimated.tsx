import {useEffect} from 'react';
import {
    AnimatableValue,
    SharedValue,
    cancelAnimation,
    useSharedValue,
} from 'react-native-reanimated';
import {useTheme} from 'styled-components/native';
import {
    AnimatedTiming,
    AnimatedTimingOptions,
    useAnimatedTiming,
} from '../../../hooks/useAnimatedTiming';
import {RenderProps} from './RippleBase';

interface UseAnimatedOptions extends Pick<RenderProps, 'onEntryAnimatedFinished' | 'active'> {
    minDuration: number;
    sequence: string;
}

interface CreateEntryAnimatedOptions extends Pick<UseAnimatedOptions, 'minDuration' | 'active'> {
    opacity: SharedValue<AnimatableValue>;
    scale: SharedValue<AnimatableValue>;
}

type CreateExitAnimatedOptions = Omit<CreateEntryAnimatedOptions, 'minDuration'>;
type ProcessAnimatedTimingOptions = CreateEntryAnimatedOptions &
    CreateExitAnimatedOptions &
    Pick<UseAnimatedOptions, 'onEntryAnimatedFinished' | 'sequence'>;

const createEntryAnimated =
    (
        animatedTiming: AnimatedTiming,
        {active, minDuration, scale, opacity}: CreateEntryAnimatedOptions,
    ) =>
    (callback?: () => void) => {
        const animatedTimingOptions = {
            duration: Math.min(minDuration, 400),
            easing: 'emphasizedDecelerate',
            toValue: 1,
        } as AnimatedTimingOptions;

        if (typeof active === 'boolean') {
            animatedTiming(scale, animatedTimingOptions);
            animatedTiming(opacity, animatedTimingOptions, finished => finished && callback?.());

            return;
        }

        animatedTiming(scale, animatedTimingOptions, finished => finished && callback?.());
    };

const createExitAnimated =
    (animatedTiming: AnimatedTiming, {active, scale, opacity}: CreateExitAnimatedOptions) =>
    (callback?: () => void) => {
        const animatedTimingOptions = {
            duration: 'short3',
            easing: 'emphasizedAccelerate',
            toValue: 0,
        } as AnimatedTimingOptions;

        if (typeof active === 'boolean') {
            animatedTiming(scale, animatedTimingOptions);
            animatedTiming(opacity, animatedTimingOptions, finished => finished && callback?.());

            return;
        }

        animatedTiming(opacity, animatedTimingOptions, finished => finished && callback?.());
    };

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {
        active,
        minDuration,
        onEntryAnimatedFinished,
        opacity,
        scale,
        sequence,
    }: ProcessAnimatedTimingOptions,
) => {
    const entryAnimated = createEntryAnimated(animatedTiming, {
        active,
        minDuration,
        opacity,
        scale,
    });

    const exitAnimated = createExitAnimated(animatedTiming, {
        active,
        opacity,
        scale,
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
    const opacity = useSharedValue(1);
    const scale = useSharedValue(active ? 1 : 0);
    const theme = useTheme();
    const [animatedTiming] = useAnimatedTiming(theme);

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {
            active,
            minDuration,
            onEntryAnimatedFinished,
            opacity,
            scale,
            sequence,
        });

        return () => {
            cancelAnimation(opacity);
            cancelAnimation(scale);
        };
    }, [active, animatedTiming, minDuration, onEntryAnimatedFinished, opacity, scale, sequence]);

    return [{opacity, scale}];
};
