import {useEffect} from 'react';
import {useTheme} from 'styled-components/native';
import {HOOK} from '../../../hooks/hook';
import {UTIL} from '../../../utils/util';
import {RenderProps} from './NavigationRailItemBase';

export interface UseAnimatedOptions
    extends Pick<RenderProps, 'active' | 'block'> {
    defaultActive?: boolean;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {active, block, defaultActive} = options;
    const [labelAnimated] = HOOK.useAnimatedValue(
        block || defaultActive ? 1 : 0,
    );
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const height = labelAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, theme.typography.label.medium.lineHeight],
    });

    const color = labelAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.palette.surface.onSurfaceVariant,
            theme.palette.surface.onSurface,
        ],
    });

    useEffect(() => {
        if (!block && typeof active === 'boolean') {
            requestAnimationFrame(() => {
                animatedTiming(labelAnimated, {
                    toValue: active ? 1 : 0,
                }).start();
            });
        }
    }, [active, animatedTiming, block, labelAnimated]);

    return {height, color};
};
