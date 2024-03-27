import {useEffect, useMemo} from 'react'
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
import {EventName} from '../Common/interface'
import {RenderProps} from './UnderlayBase'

type UseAnimatedOptions = Pick<RenderProps, 'eventName' | 'opacities'>
interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    opacity: SharedValue<AnimatableValue>
    event: Record<EventName, number>
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {opacity, eventName = 'none', event}: ProcessAnimatedTimingOptions
) =>
    animatedTiming(opacity, {
        toValue: event[eventName] ?? 0
    })

export const useAnimated = ({
    eventName,
    opacities = [0, 0.08, 0.12]
}: UseAnimatedOptions) => {
    const opacity = useSharedValue(0)
    const theme = useTheme()
    const [animatedTiming] = useAnimatedTiming(theme)
    const activeValue = opacities.length === 3 ? opacities.length - 1 : 0
    const event = useMemo(
        () =>
            ({
                blur: 0,
                focus: activeValue,
                hoverIn: 1,
                hoverOut: 0,
                longPress: activeValue,
                none: 0,
                press: 1,
                pressIn: activeValue,
                pressOut: 1
            }) as Record<EventName, number>,
        [activeValue]
    )

    const opacityInputRange = opacities.map((_value, index) => index)
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(opacity.value, opacityInputRange, opacities)
    }))

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {event, eventName, opacity})
    }, [animatedTiming, event, eventName, opacity])

    useEffect(() => () => cancelAnimation(opacity), [opacity])

    return [animatedStyle]
}
