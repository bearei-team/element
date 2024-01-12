import {useEffect} from 'react';
import {useTheme} from 'styled-components/native';
import {HOOK} from '../../hooks/hook';
import {UTIL} from '../../utils/util';

export interface UseAnimatedOptions {
    listVisible?: boolean;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {listVisible} = options;
    const [innerHeightAnimated] = HOOK.useAnimatedValue(0);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const innerHeight = innerHeightAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [
            theme.adaptSize(theme.spacing.small * 7),
            theme.adaptSize(theme.spacing.small * 40),
        ],
    });

    useEffect(() => {
        requestAnimationFrame(() =>
            animatedTiming(innerHeightAnimated, {
                toValue: listVisible ? 1 : 0,
                useNativeDriver: false,
            }).start(),
        );
    }, [animatedTiming, innerHeightAnimated, listVisible]);

    return [{innerHeight}];
};
