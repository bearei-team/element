import {FC, useCallback, useEffect, useId} from 'react';
import {ElevationProps} from './Elevation';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {useTheme} from 'styled-components/native';
import {UTIL} from '../../utils/util';
import {Animated, LayoutChangeEvent} from 'react-native';
import {useImmer} from 'use-immer';

export interface RenderProps extends ElevationProps {
    shadowStyle: {
        width: number;
        height: number;
        opacity0: Animated.AnimatedInterpolation<string | number>;
        opacity1: Animated.AnimatedInterpolation<string | number>;
    };
}

export interface ProcessAnimatedTimingOptions {
    animatedValue: Animated.Value;
}

export interface BaseElevationProps extends ElevationProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseElevation: FC<BaseElevationProps> = ({
    level = 0,
    render,
    onLayout,
    ...renderProps
}) => {
    const id = useId();
    const theme = useTheme();
    const [layout, setLayout] = useImmer({} as RenderProps['shadowStyle']);
    const [shadowAnimated] = useAnimatedValue(0);
    const shadow0Opacity = shadowAnimated.interpolate({
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

    const shadow1Opacity = shadowAnimated.interpolate({
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

    const processLayout = (event: LayoutChangeEvent) => {
        const {width, height} = event.nativeEvent.layout;

        setLayout(() => ({width, height}));
        onLayout?.(event);
    };

    const processAnimatedTiming = useCallback(
        (toValue: ElevationProps['level'] = 0, {animatedValue}: ProcessAnimatedTimingOptions) => {
            const animatedTiming = UTIL.animatedTiming(theme);
            const animated = (): number =>
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
        processAnimatedTiming(level, {animatedValue: shadowAnimated});
    }, [shadowAnimated, level, processAnimatedTiming]);

    return render({
        ...renderProps,
        id,
        level,
        shadowStyle: {
            width: layout.width,
            height: layout.height,
            opacity0: shadow0Opacity,
            opacity1: shadow1Opacity,
        },
        onLayout: processLayout,
    });
};
