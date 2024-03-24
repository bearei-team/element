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
import {RenderProps} from './RippleBase'

interface UseAnimatedOptions
    extends Pick<RenderProps, 'onEntryAnimatedFinished' | 'active'> {
    radius: number
    sequence: string
}

interface CreateEntryAnimatedOptions
    extends Pick<UseAnimatedOptions, 'active'> {
    opacity: SharedValue<AnimatableValue>
    scale: SharedValue<AnimatableValue>
}

type CreateExitAnimatedOptions = CreateEntryAnimatedOptions
type ProcessAnimatedTimingOptions = CreateEntryAnimatedOptions &
    CreateExitAnimatedOptions &
    Pick<UseAnimatedOptions, 'onEntryAnimatedFinished' | 'sequence'>

const createEntryAnimated =
    (
        animatedTiming: AnimatedTiming,
        {active, scale, opacity}: CreateEntryAnimatedOptions
    ) =>
    (callback?: () => void) => {
        const animatedTimingOptions = {toValue: 1}

        if (typeof active === 'boolean') {
            animatedTiming(scale, animatedTimingOptions)
            animatedTiming(
                opacity,
                animatedTimingOptions,
                finished => finished && callback?.()
            )

            return
        }

        animatedTiming(
            scale,
            animatedTimingOptions,
            finished => finished && callback?.()
        )
    }

const createExitAnimated =
    (
        animatedTiming: AnimatedTiming,
        {active, scale, opacity}: CreateExitAnimatedOptions
    ) =>
    (callback?: () => void) => {
        const animatedTimingOptions = {toValue: 0}

        if (typeof active === 'boolean') {
            animatedTiming(scale, animatedTimingOptions)
            animatedTiming(
                opacity,
                animatedTimingOptions,
                finished => finished && callback?.()
            )

            return
        }

        animatedTiming(
            opacity,
            animatedTimingOptions,
            finished => finished && callback?.()
        )
    }

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {
        active,
        onEntryAnimatedFinished,
        opacity,
        scale,
        sequence
    }: ProcessAnimatedTimingOptions
) => {
    const entryAnimated = createEntryAnimated(animatedTiming, {
        active,
        opacity,
        scale
    })

    const exitAnimated = createExitAnimated(animatedTiming, {
        active,
        opacity,
        scale
    })

    if (typeof active === 'boolean') {
        return active ? entryAnimated() : exitAnimated()
    }

    entryAnimated(() => onEntryAnimatedFinished?.(sequence, exitAnimated))
}

export const useAnimated = ({
    active,
    onEntryAnimatedFinished,
    radius,
    sequence
}: UseAnimatedOptions) => {
    const opacity = useSharedValue(1)
    const scale = useSharedValue(active ? 1 : 0)
    const theme = useTheme()
    const [animatedTiming] = useAnimatedTiming(theme)
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(opacity.value, [0, 1], [0, 1]),
        transform: [
            {translateY: -radius},
            {translateX: -radius},
            {scale: interpolate(scale.value, [0, 1], [0, 1])}
        ]
    }))

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {
            active,
            onEntryAnimatedFinished,
            opacity,
            scale,
            sequence
        })

        return () => {
            cancelAnimation(opacity)
            cancelAnimation(scale)
        }
    }, [
        active,
        animatedTiming,
        onEntryAnimatedFinished,
        opacity,
        scale,
        sequence
    ])

    return [animatedStyle]
}
