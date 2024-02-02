import {useCallback, useEffect} from 'react';
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
    scaleAnimated: Animated.Value;
}

export interface ExitAnimatedOptions {
    activeRipple: boolean;
    opacityAnimated: Animated.Value;
    scaleAnimated: Animated.Value;
}

export type ProcessAnimatedTimingOptions = EntryAnimatedOptions &
    ExitAnimatedOptions &
    Pick<UseAnimatedOptions, 'onEntryAnimatedEnd' | 'sequence'>;

export type ProcessDefaultActiveOptions = Pick<
    UseAnimatedOptions,
    'sequence' | 'onEntryAnimatedEnd'
> & {exitAnimated: () => void};

export type ProcessActiveOptions = {
    activeRipple: boolean;
    processAnimated: () => void;
};

const processEntryAnimated =
    (animatedTiming: AnimatedTiming, {scaleAnimated, minDuration}: EntryAnimatedOptions) =>
    (finished?: () => void) =>
        requestAnimationFrame(() =>
            animatedTiming(scaleAnimated, {
                duration: Math.min(minDuration, 400),
                easing: 'emphasizedDecelerate',
                toValue: 1,
            }).start(finished),
        );

const processExitAnimated =
    (
        animatedTiming: AnimatedTiming,
        {activeRipple, opacityAnimated, scaleAnimated}: ExitAnimatedOptions,
    ) =>
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

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {
        activeRipple,
        minDuration,
        onEntryAnimatedEnd,
        opacityAnimated,
        scaleAnimated,
        sequence,
    }: ProcessAnimatedTimingOptions,
) => {
    const entryAnimated = processEntryAnimated(animatedTiming, {
        scaleAnimated,
        minDuration,
    });

    const exitAnimated = processExitAnimated(animatedTiming, {
        activeRipple,
        opacityAnimated,
        scaleAnimated,
    });

    entryAnimated(() => onEntryAnimatedEnd?.(sequence, exitAnimated));
};

const processDefaultActive = (
    {onEntryAnimatedEnd, sequence, exitAnimated}: ProcessDefaultActiveOptions,
    defaultActive?: boolean,
) => defaultActive && onEntryAnimatedEnd?.(sequence, exitAnimated);

const processActive = ({activeRipple, processAnimated}: ProcessActiveOptions, active?: boolean) => {
    const runAnimated = !activeRipple || active;

    runAnimated && processAnimated();
};

export const useAnimated = ({
    active,
    defaultActive,
    minDuration,
    onEntryAnimatedEnd,
    sequence,
}: UseAnimatedOptions) => {
    const setDefaultActive = defaultActive && typeof active !== 'boolean';
    const [opacityAnimated] = HOOK.useAnimatedValue(1);
    const [scaleAnimated] = HOOK.useAnimatedValue(setDefaultActive ? 1 : 0);
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

    const exitAnimated = useCallback(
        () => processExitAnimated(animatedTiming, {activeRipple, opacityAnimated, scaleAnimated})(),
        [activeRipple, animatedTiming, opacityAnimated, scaleAnimated],
    );

    const processAnimated = useCallback(
        () =>
            processAnimatedTiming(animatedTiming, {
                activeRipple,
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
        processDefaultActive({sequence, onEntryAnimatedEnd, exitAnimated}, setDefaultActive);
    }, [exitAnimated, onEntryAnimatedEnd, sequence, setDefaultActive]);

    useEffect(() => {
        processActive({activeRipple, processAnimated}, active);
    }, [active, activeRipple, processAnimated]);

    return [{opacity, scale}];
};
