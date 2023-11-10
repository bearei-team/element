import {useCallback, useEffect, useMemo} from 'react';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {ShapeProps} from '../Common/Common.styles';
import {State} from '../Common/interface';
import {Type} from './Button';

export interface UseShapePropsOptions {
    state: State;
    type: Type;
    disabled: boolean;
}

export const useShapeProps = ({state, type, disabled}: UseShapePropsOptions): ShapeProps => {
    const theme = useTheme();
    const [borderAnimated] = useAnimatedValue(0);
    const inputRange = useMemo(() => [0, 1, 2], []);
    const borderColor = borderAnimated.interpolate({
        inputRange,
        outputRange: [
            theme.palette.outline.outline,
            theme.palette.primary.primary,
            theme.color.rgba(theme.palette.surface.onSurface, 0.12),
        ],
    });

    const processAnimatedTiming = useCallback(
        (toValue: number) => {
            const animatedTiming = UTIL.animatedTiming(theme);

            requestAnimationFrame(() =>
                animatedTiming(borderAnimated, {
                    toValue: toValue,
                    easing: 'standard',
                    duration: 'short3',
                }).start(),
            );
        },
        [borderAnimated, theme],
    );

    useEffect(() => {
        if (type === 'outlined') {
            const value = disabled ? inputRange[inputRange.length - 1] : 0;
            const toValue = state === 'focused' ? inputRange[1] : value;

            processAnimatedTiming(toValue);
        }
    }, [disabled, inputRange, processAnimatedTiming, state, type]);

    return {
        ...(type === 'outlined' && {
            border: {color: borderColor, style: 'solid', width: 1},
        }),
        shape: 'full',
    };
};
