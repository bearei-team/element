import {useEffect} from 'react';
import {useTheme} from 'styled-components/native';
import {HOOK} from '../../../hooks/hook';
import {UTIL} from '../../../utils/util';
import {RenderProps} from './NavigationRailItemBase';

export interface UseAnimatedOptions extends Pick<RenderProps, 'active' | 'block'> {
    defaultActive?: boolean;
}

export const useAnimated = ({active, block, defaultActive}: UseAnimatedOptions) => {
    const [labelAnimated] = HOOK.useAnimatedValue(block || defaultActive ? 1 : 0);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const height = labelAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, theme.typography.label.medium.lineHeight],
    });

    const color = labelAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.color.rgba(theme.palette.surface.onSurfaceVariant, 1),
            theme.color.rgba(theme.palette.surface.onSurface, 1),
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

    return [{height, color}];
};
