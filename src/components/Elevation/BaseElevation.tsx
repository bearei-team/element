import {FC, useCallback, useEffect, useId} from 'react';
import {ElevationProps} from './Elevation';
import {useTheme} from 'styled-components/native';
import {Animated} from 'react-native';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {UTIL} from '../../utils/util';

export type RenderProps = ElevationProps & {
    shadowStyle: {
        shadowOpacity0: Animated.AnimatedInterpolation<string | number>;
        shadowOpacity1: Animated.AnimatedInterpolation<string | number>;
    };
};

export interface BaseElevationProps extends ElevationProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseElevation: FC<BaseElevationProps> = ({level, render, ...renderProps}) => {
    const id = useId();
    const theme = useTheme();
    const [opacity0Animated] = useAnimatedValue(0);
    const [opacity1Animated] = useAnimatedValue(0);
    const shadowOpacity0 = opacity0Animated.interpolate({
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

    const shadowOpacity1 = opacity1Animated.interpolate({
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

    const processAnimatedTiming = useCallback(
        (value: ElevationProps['level'] = 0) => {
            const animatedTiming = UTIL.animatedTiming(theme);
            const animated0In = (): number =>
                requestAnimationFrame(() =>
                    animatedTiming(opacity0Animated, {
                        toValue: value,
                        easing: 'standard',
                        duration: 'short3',
                    }).start(),
                );

            const animated1In = (): number =>
                requestAnimationFrame(() =>
                    animatedTiming(opacity1Animated, {
                        toValue: value,
                        easing: 'standard',
                        duration: 'short3',
                    }).start(),
                );

            animated0In();
            animated1In();
        },
        [opacity0Animated, opacity1Animated, theme],
    );

    const elevation = render({
        ...renderProps,
        id,
        level,
        shadowStyle: {shadowOpacity0, shadowOpacity1},
    });

    useEffect(() => {
        processAnimatedTiming(level);
    }, [level, processAnimatedTiming]);

    return elevation;
};
