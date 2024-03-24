import {useEffect} from 'react'
import {
    AnimatableValue,
    SharedValue,
    cancelAnimation,
    interpolate,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated'
import {useTheme} from 'styled-components/native'
import {AnimatedTiming, useAnimatedTiming} from '../../hooks/useAnimatedTiming'
import {ElevationProps} from './Elevation'

type UseAnimatedOptions = Pick<ElevationProps, 'level' | 'defaultLevel'>
interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    shadow: SharedValue<AnimatableValue>
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {shadow, level = 0}: ProcessAnimatedTimingOptions
) => animatedTiming(shadow, {toValue: level})

export const useAnimated = ({level = 0}: UseAnimatedOptions) => {
    const shadow = useSharedValue(0)
    const theme = useTheme()
    const [animatedTiming] = useAnimatedTiming(theme)
    const shadow0AnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            shadow.value,
            [0, 1, 2, 3, 4, 5],
            [
                theme.elevation.level0.shadow0.opacity,
                theme.elevation.level1.shadow0.opacity,
                theme.elevation.level2.shadow0.opacity,
                theme.elevation.level3.shadow0.opacity,
                theme.elevation.level4.shadow0.opacity,
                theme.elevation.level5.shadow0.opacity
            ]
        )
    }))

    const shadow1AnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            shadow.value,
            [0, 1, 2, 3, 4, 5],
            [
                theme.elevation.level0.shadow1.opacity,
                theme.elevation.level1.shadow1.opacity,
                theme.elevation.level2.shadow1.opacity,
                theme.elevation.level3.shadow1.opacity,
                theme.elevation.level4.shadow1.opacity,
                theme.elevation.level5.shadow1.opacity
            ]
        )
    }))

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {level, shadow})

        return () => {
            cancelAnimation(shadow)
        }
    }, [animatedTiming, level, shadow])

    return [{shadow1AnimatedStyle, shadow0AnimatedStyle}]
}
