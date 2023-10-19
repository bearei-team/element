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

export type RippleAnimationOut = (finished: () => void) => number;
export interface BaseRippleProps extends ViewProps {
    sequence?: string;
    centered?: boolean;
    underlayColor?: string;
    touchableLayout: LayoutRectangle;
    touchableEvent: NativeTouchEvent;
    onAnimationEnd: (sequence: string, animatedOut: RippleAnimationOut) => void;
}

export interface RenderContainerProps extends ViewProps {
    x: number;
    y: number;
    isRTL: boolean;
    underlayColor?: string;
}

export type RenderMainProps = Animated.AnimatedProps<ViewProps & React.RefAttributes<View>> &
    Pick<BaseRippleProps, 'underlayColor'>;
export interface RippleProps extends BaseRippleProps {
    renderMain: (props: RenderMainProps) => React.JSX.Element;
    renderContainer: (props: RenderContainerProps) => React.JSX.Element;
}

export const BaseRipple: FC<RippleProps> = ({
    sequence,
    centered = false,
    underlayColor,
    touchableEvent,
    touchableLayout,
    onAnimationEnd,
    renderMain,
    renderContainer,
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
    const scale = scaleAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.5 / baseRadius, radius / baseRadius],
    });

    const opacity = opacityAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
    });

    const processAnimatedTiming = useCallback((): void => {
        const animatedTiming = UTIL.animatedTiming(theme);
        const animatedIn = (finished: () => void): number =>
            requestAnimationFrame(() =>
                animatedTiming(scaleAnimation, {
                    toValue: 1,
                    easing: 'linear',
                    duration: 'medium1',
                }).start(finished),
            );

        const animatedOut = (finished: () => void): number =>
            requestAnimationFrame(() =>
                animatedTiming(opacityAnimation, {
                    toValue: 1,
                    easing: 'linear',
                    duration: 'medium1',
                }).start(finished),
            );

        const finished = (): void => onAnimationEnd?.(sequence ?? id, animatedOut);

        animatedIn(finished);
    }, [id, onAnimationEnd, opacityAnimation, scaleAnimation, sequence, theme]);

    const main = renderMain({
        id,
        underlayColor: underlayColor ?? theme.palette.surface.onSurface,
        style: {transform: [{scale}], opacity},
    });

    const container = renderContainer({
        ...args,
        id,
        x: locationX - baseRadius,
        y: locationY - baseRadius,
        isRTL: I18nManager.isRTL,
        children: main,
    });

    useEffect(() => {
        processAnimatedTiming();
    }, [processAnimatedTiming]);

    return container;
};
