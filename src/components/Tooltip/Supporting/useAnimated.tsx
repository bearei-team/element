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
import {
    AnimatedTiming,
    useAnimatedTiming
} from '../../../hooks/useAnimatedTiming'
import {RenderProps} from './SupportingBase'

interface UseAnimatedOptions extends Pick<RenderProps, 'visible'> {
    onClosed: (value?: boolean) => void
}

interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    opacity: SharedValue<AnimatableValue>
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {opacity, visible, onClosed}: ProcessAnimatedTimingOptions
) =>
    animatedTiming(
        opacity,
        {toValue: visible ? 1 : 0},
        finished => finished && !visible && onClosed?.(visible)
    )

export const useAnimated = ({visible, onClosed}: UseAnimatedOptions) => {
    const opacity = useSharedValue(visible ? 1 : 0)
    const theme = useTheme()
    const [animatedTiming] = useAnimatedTiming(theme)
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(opacity.value, [0, 1], [0, 1])
    }))

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {opacity, visible, onClosed})
    }, [animatedTiming, onClosed, opacity, visible])

    useEffect(() => () => cancelAnimation(opacity), [opacity])

    return [animatedStyle]
}
