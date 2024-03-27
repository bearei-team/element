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
import {RenderProps} from './IconBase'

type UseAnimatedOptions = Pick<RenderProps, 'eventName'>
interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    scale: SharedValue<AnimatableValue>
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {scale, eventName = 'none'}: ProcessAnimatedTimingOptions
) => {
    const toValue = ['pressIn', 'longPress'].includes(eventName) ? 0 : 1

    animatedTiming(scale, {
        toValue: eventName === 'hoverIn' ? 2 : toValue
    })
}

export const useAnimated = ({eventName}: UseAnimatedOptions) => {
    const scale = useSharedValue(1)
    const theme = useTheme()
    const [animatedTiming] = useAnimatedTiming(theme)
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            {scale: interpolate(scale.value, [0, 1, 2], [0.97, 1, 1.03])}
        ]
    }))

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {eventName, scale})
    }, [animatedTiming, eventName, scale])

    useEffect(() => () => cancelAnimation(scale), [scale])

    return [{animatedStyle}]
}
