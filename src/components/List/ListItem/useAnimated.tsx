import {useCallback, useEffect} from 'react';
import {useTheme} from 'styled-components/native';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {UTIL} from '../../../utils/util';
import {EventName, State} from '../../Common/interface';
import {RenderProps} from './ListItemBase';

export interface UseAnimatedOptions extends Pick<RenderProps, 'close'> {
    eventName: EventName;
    layoutHeight?: number;
    state: State;
    trailingEventName: EventName;
}

export const useAnimated = (options: UseAnimatedOptions) => {
    const {
        close,
        eventName,
        layoutHeight = 0,
        state,
        trailingEventName,
    } = options;

    const [heightAnimated] = useAnimatedValue(1);
    const [trailingOpacityAnimated] = useAnimatedValue(close ? 0 : 1);
    const theme = useTheme();
    const animatedTiming = UTIL.animatedTiming(theme);
    const trailingOpacity = trailingOpacityAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const height = heightAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, layoutHeight],
    });

    const processCloseAnimated = useCallback(
        (finished?: () => void) => {
            requestAnimationFrame(() =>
                animatedTiming(heightAnimated, {
                    toValue: 0,
                    useNativeDriver: false,
                }).start(finished),
            );
        },
        [heightAnimated, animatedTiming],
    );

    useEffect(() => {
        const closeIconValue = state !== 'enabled' ? 1 : 0;
        const closeIconToValue = [eventName, trailingEventName].includes(
            'hoverIn',
        )
            ? 1
            : closeIconValue;

        requestAnimationFrame(() => {
            animatedTiming(trailingOpacityAnimated, {
                toValue: close ? closeIconToValue : 1,
            }).start();
        });
    }, [
        close,
        eventName,
        animatedTiming,
        state,
        trailingEventName,
        trailingOpacityAnimated,
    ]);

    return {
        height,
        onCloseAnimated: processCloseAnimated,
        trailingOpacity,
    };
};
