import {FC, useCallback, useEffect, useId} from 'react';
import {HoveredProps} from './Hovered';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {useTheme} from 'styled-components/native';

export type RenderProps = Omit<HoveredProps, 'state' | 'disabled'>;
export interface BaseHoveredProps extends HoveredProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseHovered: FC<BaseHoveredProps> = ({
    render,
    state: propsState,
    disabled = false,
    ...args
}) => {
    const id = useId();
    const theme = useTheme();
    const [opacityAnimated] = useAnimatedValue(0);
    const animatedTiming = UTIL.animatedTiming(theme);
    const animatedIn = useCallback(
        (): number =>
            requestAnimationFrame(() =>
                animatedTiming(opacityAnimated, {
                    toValue: 1,
                    easing: 'standard',
                    duration: 'short3',
                }).start(),
            ),
        [animatedTiming, opacityAnimated],
    );

    const animatedOut = useCallback(
        (): number =>
            requestAnimationFrame(() =>
                animatedTiming(opacityAnimated, {
                    toValue: 0,
                    easing: 'standard',
                    duration: 'short3',
                }).start(),
            ),
        [animatedTiming, opacityAnimated],
    );

    const hovered = render({
        ...args,
        id,
        style: {
            opacity: opacityAnimated.interpolate({
                inputRange: [0, 1],
                outputRange: [0, propsState === 'focused' ? 0.12 : 0.08],
            }),
        },
    });

    useEffect(() => {
        if (propsState && !disabled) {
            propsState === 'hovered' || propsState === 'focused' ? animatedIn() : animatedOut();
        }
    }, [animatedIn, animatedOut, disabled, propsState]);

    return hovered;
};
