import {useEffect} from 'react'
import {
    AnimatableValue,
    SharedValue,
    cancelAnimation,
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated'
import {useTheme} from 'styled-components/native'
import {
    AnimatedTiming,
    useAnimatedTiming
} from '../../../hooks/useAnimatedTiming'
import {RenderProps} from './NavigationRailItemBase'

interface UseAnimatedOptions extends Pick<RenderProps, 'active' | 'type'> {
    defaultActive?: boolean
}

interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    labelText: SharedValue<AnimatableValue>
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {type, active, labelText}: ProcessAnimatedTimingOptions
) => {
    type === 'segment' &&
        typeof active === 'boolean' &&
        animatedTiming(labelText, {
            toValue: active ? 1 : 0
        })
}

export const useAnimated = ({active, type}: UseAnimatedOptions) => {
    const labelText = useSharedValue(type === 'block' || active ? 1 : 0)
    const theme = useTheme()
    const [animatedTiming] = useAnimatedTiming(theme)
    const labelTextAnimatedStyle = useAnimatedStyle(() => ({
        height: interpolate(
            labelText.value,
            [0, 1],
            [0, theme.adaptSize(theme.typography.label.medium.lineHeight)]
        ),
        color: interpolateColor(
            labelText.value,
            [0, 1],
            [
                theme.color.convertHexToRGBA(
                    theme.palette.surface.onSurfaceVariant,
                    1
                ),
                theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 1)
            ]
        )
    }))

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {active, type, labelText})

        return () => {
            cancelAnimation(labelText)
        }
    }, [active, animatedTiming, type, labelText])

    return [labelTextAnimatedStyle]
}
