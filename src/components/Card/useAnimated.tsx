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
    borderInputRange: number[]
}

interface ProcessAnimatedTimingOptions extends ProcessOutlinedAnimatedOptions {
    color: SharedValue<AnimatableValue>
}

const processOutlinedAnimated = (
    animatedTiming: AnimatedTiming,
    {
        border,
        borderInputRange,
        disabled,
        eventName
    }: ProcessOutlinedAnimatedOptions
) => {
    const value = disabled ? 0 : borderInputRange[borderInputRange.length - 2]
    const toValue = eventName === 'focus' ? borderInputRange[2] : value

    return animatedTiming(border, {toValue})
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {
        border,
        borderInputRange,
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
            borderInputRange,
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
    const borderInputRange = useMemo(() => [0, 1, 2], [])
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

    const contentAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            color.value,
            backgroundColorType[type].inputRange,
            backgroundColorType[type].outputRange
        ),

        ...(type === 'outlined' && {
            borderColor: interpolateColor(border.value, borderInputRange, [
                disabledBackgroundColor,
                theme.color.convertHexToRGBA(
                    theme.palette.outline.outlineVariant,
                    1
                ),
                theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 1)
            ])
        })
    }))

    const titleTextAnimatedStyle = useAnimatedStyle(() => ({
        color: interpolateColor(
            color.value,
            [0, 1],
            [
                disabledColor,
                theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 1)
            ]
        )
    }))

    const subheadTextAnimatedStyle = useAnimatedStyle(() => ({
        color: interpolateColor(
            color.value,
            [0, 1],
            [
                disabledColor,
                theme.color.convertHexToRGBA(
                    theme.palette.surface.onSurfaceVariant,
                    1
                )
            ]
        )
    }))

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {
            border,
            borderInputRange,
            color,
            disabled,
            eventName,
            type
        })

        return () => {
            cancelAnimation(border)
            cancelAnimation(color)
        }
    }, [
        animatedTiming,
        border,
        borderInputRange,
        color,
        disabled,
        eventName,
        type
    ])

    return [
        {
            contentAnimatedStyle,
            subheadTextAnimatedStyle,
            titleTextAnimatedStyle
        }
    ]
}
