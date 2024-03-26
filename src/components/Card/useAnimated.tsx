import {useEffect, useMemo} from 'react'
import {
    AnimatableValue,
    SharedValue,
    cancelAnimation,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated'
import {useTheme} from 'styled-components/native'
import {AnimatedTiming, useAnimatedTiming} from '../../hooks/useAnimatedTiming'
import {RenderProps} from './CardBase'

type UseAnimatedOptions = Pick<RenderProps, 'disabled' | 'type' | 'eventName'>
interface ProcessOutlinedAnimatedOptions extends UseAnimatedOptions {
    border: SharedValue<AnimatableValue>
    borderColorInputRange: number[]
}

interface ProcessAnimatedTimingOptions extends ProcessOutlinedAnimatedOptions {
    color: SharedValue<AnimatableValue>
}

const processOutlinedAnimated = (
    animatedTiming: AnimatedTiming,
    {
        border,
        borderColorInputRange,
        disabled,
        eventName
    }: ProcessOutlinedAnimatedOptions
) => {
    const value =
        disabled ? 0 : borderColorInputRange[borderColorInputRange.length - 2]
    const toValue = eventName === 'focus' ? borderColorInputRange[2] : value

    return animatedTiming(border, {toValue})
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {
        border,
        borderColorInputRange,
        color,
        disabled,
        eventName,
        type = 'filled'
    }: ProcessAnimatedTimingOptions
) => {
    const toValue = disabled ? 0 : 1

    if (type === 'outlined') {
        processOutlinedAnimated(animatedTiming, {
            border,
            borderColorInputRange,
            disabled,
            eventName,
            type
        })

        animatedTiming(color, {toValue})

        return
    }

    animatedTiming(color, {toValue})
}

export const useAnimated = ({
    disabled,
    type = 'filled',
    eventName
}: UseAnimatedOptions) => {
    const animatedValue = disabled ? 0 : 1
    const border = useSharedValue(animatedValue)
    const color = useSharedValue(animatedValue)
    const borderColorInputRange = useMemo(() => [0, 1, 2], [])
    const theme = useTheme()
    const [animatedTiming] = useAnimatedTiming(theme)
    const disabledBackgroundColor = theme.color.convertHexToRGBA(
        theme.palette.surface.onSurface,
        0.12
    )

    const disabledColor = theme.color.convertHexToRGBA(
        theme.palette.surface.onSurface,
        0.38
    )
    const backgroundColorType = {
        elevated: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.color.convertHexToRGBA(
                    theme.palette.surface.surfaceContainerLow,
                    1
                )
            ]
        },
        filled: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.color.convertHexToRGBA(
                    theme.palette.surface.surfaceContainerHighest,
                    1
                )
            ]
        },
        outlined: {
            inputRange: [0, 1],
            outputRange: [
                theme.color.convertHexToRGBA(theme.palette.surface.surface, 1),
                theme.color.convertHexToRGBA(theme.palette.surface.surface, 1)
            ]
        }
    }

    const borderColorOutputRange = [
        disabledBackgroundColor,
        theme.color.convertHexToRGBA(theme.palette.outline.outlineVariant, 1),
        theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 1)
    ]

    const contentAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            color.value,
            backgroundColorType[type].inputRange,
            backgroundColorType[type].outputRange
        ),

        ...(type === 'outlined' && {
            borderColor: interpolateColor(
                border.value,
                borderColorInputRange,
                borderColorOutputRange
            )
        })
    }))

    const titleTextColorOutputRange = [
        disabledColor,
        theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 1)
    ]

    const titleTextAnimatedStyle = useAnimatedStyle(() => ({
        color: interpolateColor(color.value, [0, 1], titleTextColorOutputRange)
    }))

    const subheadTextColorOutputRange = [
        disabledColor,
        theme.color.convertHexToRGBA(theme.palette.surface.onSurfaceVariant, 1)
    ]

    const subheadTextAnimatedStyle = useAnimatedStyle(() => ({
        color: interpolateColor(
            color.value,
            [0, 1],
            subheadTextColorOutputRange
        )
    }))

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {
            border,
            borderColorInputRange,
            color,
            disabled,
            eventName,
            type
        })
    }, [
        animatedTiming,
        border,
        borderColorInputRange,
        color,
        disabled,
        eventName,
        type
    ])

    useEffect(
        () => () => {
            cancelAnimation(border)
            cancelAnimation(color)
        },
        [border, color]
    )

    return [
        {
            contentAnimatedStyle,
            subheadTextAnimatedStyle,
            titleTextAnimatedStyle
        }
    ]
}
