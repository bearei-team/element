import {useEffect} from 'react';
import {useTheme} from 'styled-components/native';
import {HOOK} from '../../../hooks/hook';
import {UTIL} from '../../../utils/util';

export interface UseAnimatedOptions {
    active?: boolean;
    defaultActive?: boolean;
}

export const useAnimated = ({active, defaultActive}: UseAnimatedOptions) => {
    const [activeAnimated] = HOOK.useAnimatedValue(defaultActive ? 1 : 0);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const color = activeAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.palette.surface.onSurface, theme.palette.primary.primary],
    });

    useEffect(() => {
        if (typeof active !== 'boolean') {
            return;
        }

        requestAnimationFrame(() =>
            animatedTiming(activeAnimated, {toValue: active ? 1 : 0}).start(),
        );
    }, [active, activeAnimated, animatedTiming]);

    return [{color}];
};
