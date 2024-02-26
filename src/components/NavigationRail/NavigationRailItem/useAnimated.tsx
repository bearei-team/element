import {useEffect} from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater} from 'use-immer';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {AnimatedTiming, createAnimatedTiming} from '../../../utils/animatedTiming.utils';
import {InitialState, RenderProps} from './NavigationRailItemBase';

export interface UseAnimatedOptions extends Pick<RenderProps, 'active' | 'block'> {
    defaultActive?: boolean;
    setState: Updater<InitialState>;
}

export interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    labelAnimated: Animated.Value;
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {block, active, labelAnimated, setState}: ProcessAnimatedTimingOptions,
) => {
    setState(draft => {
        if (draft.status !== 'succeeded') {
            return;
        }

        !block &&
            typeof active === 'boolean' &&
            requestAnimationFrame(() =>
                animatedTiming(labelAnimated, {
                    toValue: active ? 1 : 0,
                }).start(),
            );
    });
};

export const useAnimated = ({active, block, defaultActive, setState}: UseAnimatedOptions) => {
    const [labelAnimated] = useAnimatedValue(block || defaultActive ? 1 : 0);
    const theme = useTheme();
    const animatedTiming = createAnimatedTiming(theme);
    const height = labelAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, theme.typography.label.medium.lineHeight],
    });

    const color = labelAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.color.convertHexToRGBA(theme.palette.surface.onSurfaceVariant, 1),
            theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 1),
        ],
    });

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {active, block, labelAnimated, setState});
    }, [active, animatedTiming, block, labelAnimated, setState]);

    return [{height, color}];
};
