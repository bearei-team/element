import {FC, useCallback, useEffect, useId} from 'react';
import {ElevationProps} from './Elevation';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';
import {useTheme} from 'styled-components/native';
import {Animated, LayoutChangeEvent, LayoutRectangle} from 'react-native';
import {useImmer} from 'use-immer';

export type RenderProps = ElevationProps & {
    shadowStyle: {
        opacity0: Animated.AnimatedInterpolation<string | number>;
        opacity1: Animated.AnimatedInterpolation<string | number>;
        width: number;
        height: number;
    };
};

export interface BaseElevationProps extends ElevationProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseElevation: FC<BaseElevationProps> = ({
    render,
    level = 0,
    onLayout,
    ...args
}): React.JSX.Element => {
    const id = useId();
    const theme = useTheme();
    const [layout, setLayout] = useImmer({width: 0, height: 0} as LayoutRectangle);
    const [shadow0Animated] = useAnimatedValue(0);
    const [shadow1Animated] = useAnimatedValue(0);
    const opacity0 = shadow0Animated.interpolate({
        inputRange: [0, 1, 2, 3, 4, 5],
        outputRange: [
            theme.elevation.level0.shadow0.opacity,
            theme.elevation.level1.shadow0.opacity,
            theme.elevation.level2.shadow0.opacity,
            theme.elevation.level3.shadow0.opacity,
            theme.elevation.level4.shadow0.opacity,
            theme.elevation.level5.shadow0.opacity,
        ],
    });

    const opacity1 = shadow1Animated.interpolate({
        inputRange: [0, 1, 2, 3, 4, 5],
        outputRange: [
            theme.elevation.level0.shadow1.opacity,
            theme.elevation.level1.shadow1.opacity,
            theme.elevation.level2.shadow1.opacity,
            theme.elevation.level3.shadow1.opacity,
            theme.elevation.level4.shadow1.opacity,
            theme.elevation.level5.shadow1.opacity,
        ],
    });

    const processAnimatedTiming = useCallback((): void => {
        const animatedTiming = UTIL.animatedTiming(theme);
        const runAnimated = (): number =>
            requestAnimationFrame(() => {
                animatedTiming(shadow0Animated, {
                    toValue: level,
                    easing: 'standardDecelerate',
                    duration: 'medium1',
                }).start();

                animatedTiming(shadow1Animated, {
                    toValue: level,
                    easing: 'standardDecelerate',
                    duration: 'medium1',
                }).start();
            });

        runAnimated();
    }, [level, shadow0Animated, shadow1Animated, theme]);

    const processLayout = (event: LayoutChangeEvent): void => {
        onLayout?.(event);
        setLayout(() => event.nativeEvent.layout);
    };

    const elevation = render({
        ...args,
        id,
        level,
        shadowStyle: {opacity0, opacity1, width: layout.width, height: layout.height},
        onLayout: processLayout,
    });

    useEffect(() => {
        layout.width !== 0 && processAnimatedTiming();
    }, [layout, processAnimatedTiming]);

    return elevation;
};
