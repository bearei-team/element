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
    const [shadow0OpacityAnimated] = useAnimatedValue(0);
    const [shadow1OpacityAnimated] = useAnimatedValue(0);
    const shadow0Opacity = shadow0OpacityAnimated.interpolate({
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

    const shadow1Opacity = shadow1OpacityAnimated.interpolate({
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
        (toValue: ElevationProps['level'] = 0) => {
            const animatedTiming = UTIL.animatedTiming(theme);
            const shadow0Animated = (): number =>
                requestAnimationFrame(() =>
                    animatedTiming(shadow0OpacityAnimated, {
                        toValue,
                        easing: 'standard',
                        duration: 'short3',
                    }).start(),
                );

            const shadow1Animated = (): number =>
                requestAnimationFrame(() =>
                    animatedTiming(shadow1OpacityAnimated, {
                        toValue,
                        easing: 'standard',
                        duration: 'short3',
                    }).start(),
                );

            shadow0Animated();
            shadow1Animated();
        },
        [shadow0OpacityAnimated, shadow1OpacityAnimated, theme],
    );

    const shadowStyle = {
        width: layout.width,
        height: layout.height,
        opacity0: shadow0Opacity,
        opacity1: shadow1Opacity,
    };

    const elevation = render({
        ...renderProps,
        id,
        level,
        shadowStyle,
        onLayout: processLayout,
    });

    useEffect(() => {
        processAnimatedTiming(level);
    }, [level, processAnimatedTiming]);

    return elevation;
};
