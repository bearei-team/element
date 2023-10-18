import {FC, useCallback, useEffect, useId} from 'react';
import {
    Animated,
    I18nManager,
    LayoutRectangle,
    NativeTouchEvent,
    View,
    ViewProps,
} from 'react-native';
import {baseRadius} from './Ripple.styles';
import {useAnimatedValue} from '../../../hooks/useAnimatedValue';
import {UTIL} from '../../../utils/util';
import {useTheme} from 'styled-components/native';

export interface BaseRippleProps extends ViewProps {
    underlayColor?: string;
    centered?: boolean;
    touchableLayout: LayoutRectangle;
    touchableEvent: NativeTouchEvent;
    sequence?: string;
    onAnimationEnd: (sequence: string, animationOut: (finished: () => void) => number) => void;
}

export interface RenderRippleContainerProps extends ViewProps {
    x: number;
    y: number;
    isRTL: boolean;
    underlayColor?: string;
}

export type RenderRippleMainProps = Animated.AnimatedProps<ViewProps & React.RefAttributes<View>>;
export interface RippleProps extends BaseRippleProps {
    renderMain: (props: RenderRippleMainProps) => React.JSX.Element;
    renderContainer: (props: RenderRippleContainerProps) => React.JSX.Element;
}

export const BaseRipple: FC<RippleProps> = ({
    renderContainer,
    renderMain,
    touchableLayout,
    centered = false,
    touchableEvent,
    underlayColor,
    sequence,
    onAnimationEnd,
    ...args
}): React.JSX.Element => {
    const id = useId();
    const theme = useTheme();
    const [scaleAnimation] = useAnimatedValue(0);
    const [opacityAnimation] = useAnimatedValue(0);
    const {width, height} = touchableLayout;
    const centerX = width / 2;
    const centerY = height / 2;
    const {locationX, locationY} = centered
        ? {locationX: centerX, locationY: centerY}
        : touchableEvent;

    const offsetX = Math.abs(centerX - locationX);
    const offsetY = Math.abs(centerY - locationY);
    const radius = Math.sqrt(Math.pow(centerX + offsetX, 2) + Math.pow(centerY + offsetY, 2));
    const processAnimated = useCallback((): void => {
        const animatedTiming = UTIL.animatedTiming(theme);
        const animationIn = (finished: () => void): number =>
            requestAnimationFrame(() =>
                animatedTiming(scaleAnimation, {
                    toValue: 1,
                    easing: 'linear',
                    duration: 'medium1',
                }).start(finished),
            );

        const animationOut = (finished: () => void): number =>
            requestAnimationFrame(() =>
                animatedTiming(opacityAnimation, {
                    toValue: 1,
                    easing: 'linear',
                    duration: 'medium1',
                }).start(finished),
            );

        animationIn(() => onAnimationEnd?.(sequence ?? id, animationOut));
    }, [id, onAnimationEnd, opacityAnimation, scaleAnimation, sequence, theme]);

    const main = renderMain({
        id,
        style: {
            transform: [
                {
                    scale: scaleAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5 / baseRadius, radius / baseRadius],
                    }),
                },
            ],
            opacity: opacityAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
            }),
        },
    });

    const container = renderContainer({
        ...args,
        id,
        underlayColor,
        x: locationX - baseRadius,
        y: locationY - baseRadius,
        isRTL: I18nManager.isRTL,
        children: main,
    });

    useEffect(() => {
        processAnimated();
    }, [processAnimated]);

    return container;
};
