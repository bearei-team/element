import {FC, useCallback, useEffect, useId} from 'react';
import {HoveredProps} from './Hovered';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {useTheme} from 'styled-components/native';
import {Animated} from 'react-native';

export type RenderProps = Omit<HoveredProps, 'state' | 'disabled'>;
export interface BaseHoveredProps extends HoveredProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface ProcessAnimatedTimingOptions {
    animatedValue: Animated.Value;
}

export const BaseHovered: FC<BaseHoveredProps> = ({
    render,
    state,
    disabled = false,
    ...renderProps
}) => {
    const id = useId();
    const theme = useTheme();
    const [opacityAnimated] = useAnimatedValue(0);
    const processAnimatedTiming = useCallback(
        (toValue: number, {animatedValue}: ProcessAnimatedTimingOptions) => {
            const animatedTiming = UTIL.animatedTiming(theme);
            const animated = () =>
                requestAnimationFrame(() =>
                    animatedTiming(animatedValue, {
                        toValue,
                        easing: 'standard',
                        duration: 'short3',
                    }).start(),
                );

            animated();
        },
        [theme],
    );

    useEffect(() => {
        if (state && !disabled) {
            processAnimatedTiming(state === 'hovered' || state === 'focused' ? 1 : 0, {
                animatedValue: opacityAnimated,
            });
        }
    }, [disabled, opacityAnimated, processAnimatedTiming, state]);

    return render({
        ...renderProps,
        id,
        style: {
            opacity: opacityAnimated.interpolate({
                inputRange: [0, 1],
                outputRange: [0, state === 'focused' ? 0.12 : 0.08],
            }),
        },
    });
};
