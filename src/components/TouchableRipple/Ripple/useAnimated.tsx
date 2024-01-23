import {useEffect, useMemo} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {HOOK} from '../../../hooks/hook';
import {AnimatedTiming, AnimatedTimingOptions} from '../../../utils/animatedTiming.utils';
import {UTIL} from '../../../utils/util';
import {RenderProps} from './RippleBase';

export interface UseAnimatedOptions
    extends Pick<RenderProps, 'onEntryAnimatedEnd' | 'active' | 'defaultActive'> {
    minDuration: number;
    sequence: string;
}

export interface EntryAnimatedOptions extends Pick<UseAnimatedOptions, 'minDuration'> {
    animatedTiming: AnimatedTiming;
    scaleAnimated: Animated.Value;
}

export interface ExitAnimatedOptions {
    animatedTiming: AnimatedTiming;
    scaleAnimated: Animated.Value;
    opacityAnimated: Animated.Value;
    activeRipple: boolean;
}

export type ProcessAnimatedTimingOptions = EntryAnimatedOptions &
    ExitAnimatedOptions &
    Pick<UseAnimatedOptions, 'onEntryAnimatedEnd' | 'sequence'>;

const processEntryAnimated =
    ({scaleAnimated, minDuration, animatedTiming}: EntryAnimatedOptions) =>
    (finished?: () => void) =>
        requestAnimationFrame(() =>
            animatedTiming(scaleAnimated, {
                duration: Math.min(minDuration, 400),
                easing: 'emphasizedDecelerate',
                toValue: 1,
            }).start(finished),
        );

const processExitAnimated =
    ({activeRipple, opacityAnimated, scaleAnimated, animatedTiming}: ExitAnimatedOptions) =>
    (finished?: () => void) => {
        const animatedTimingOptions = {
            duration: 'short3',
            easing: 'emphasizedAccelerate',
            toValue: 0,
        } as AnimatedTimingOptions;

        requestAnimationFrame(() => {
            if (activeRipple) {
                return Animated.parallel([
                    animatedTiming(scaleAnimated, animatedTimingOptions),
                    animatedTiming(opacityAnimated, animatedTimingOptions),
                ]).start(finished);
            }

            animatedTiming(opacityAnimated, animatedTimingOptions).start(finished);
        });
    };

const processAnimatedTiming =
    ({
        onEntryAnimatedEnd,
        sequence,
        animatedTiming,
        activeRipple,
        opacityAnimated,
        scaleAnimated,
        minDuration,
    }: ProcessAnimatedTimingOptions) =>
    () => {
        const entryAnimated = processEntryAnimated({scaleAnimated, minDuration, animatedTiming});
        const exitAnimated = processExitAnimated({
            animatedTiming,
            activeRipple,
            opacityAnimated,
            scaleAnimated,
        });

        entryAnimated(() => onEntryAnimatedEnd?.(sequence, exitAnimated));
    };

export const useAnimated = ({
    active,
    defaultActive,
    minDuration,
    onEntryAnimatedEnd,
    sequence,
}: UseAnimatedOptions) => {
    const [opacityAnimated] = HOOK.useAnimatedValue(1);
    const [scaleAnimated] = HOOK.useAnimatedValue(
        defaultActive && typeof active !== 'boolean' ? 1 : 0,
    );

    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const activeRipple = [typeof defaultActive, typeof active].includes('boolean');
    const opacity = opacityAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const scale = scaleAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const exitAnimated = useMemo(
        () => processExitAnimated({animatedTiming, activeRipple, opacityAnimated, scaleAnimated}),
        [activeRipple, animatedTiming, opacityAnimated, scaleAnimated],
    );

    const processAnimated = useMemo(
        () =>
            processAnimatedTiming({
                activeRipple,
                animatedTiming,
                minDuration,
                onEntryAnimatedEnd,
                opacityAnimated,
                scaleAnimated,
                sequence,
            }),
        [
            activeRipple,
            animatedTiming,
            minDuration,
            onEntryAnimatedEnd,
            opacityAnimated,
            scaleAnimated,
            sequence,
        ],
    );

    useEffect(() => {
        if (defaultActive) {
            onEntryAnimatedEnd?.(sequence, exitAnimated);
        }
    }, [defaultActive, exitAnimated, onEntryAnimatedEnd, sequence]);

    useEffect(() => {
        const runAnimated = !activeRipple || active;

        if (runAnimated) {
            processAnimated();
        }
    }, [active, activeRipple, processAnimated]);

    return [{opacity, scale}];
};
