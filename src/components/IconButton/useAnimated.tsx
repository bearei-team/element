import {useEffect} from 'react'
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
import {RenderProps} from './IconButtonBase'

type UseAnimatedOptions = Pick<RenderProps, 'disabled' | 'type'>
interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    color: SharedValue<AnimatableValue>
    border: SharedValue<AnimatableValue>
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {disabled, type = 'filled', color, border}: ProcessAnimatedTimingOptions
) => {
    const toValue = disabled ? 0 : 1

    if (type === 'outlined') {
        animatedTiming(border, {toValue})
        animatedTiming(color, {toValue})

        return
    }

    animatedTiming(color, {toValue})
}

export const useAnimated = ({
    disabled,
    type = 'filled'
}: UseAnimatedOptions) => {
    const animatedValue = disabled ? 0 : 1
    const border = useSharedValue(animatedValue)
    const color = useSharedValue(animatedValue)
    const theme = useTheme()
    const [animatedTiming] = useAnimatedTiming(theme)
    const disabledBackgroundColor = theme.color.convertHexToRGBA(
        theme.palette.surface.onSurface,
        0.12
    )

    const backgroundColorType = {
        filled: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.color.convertHexToRGBA(theme.palette.primary.primary, 1)
            ]
        },
        outlined: {
            inputRange: [0, 1],
            outputRange: [
                theme.color.convertHexToRGBA(theme.palette.primary.primary, 0),
                theme.color.convertHexToRGBA(theme.palette.primary.primary, 0)
            ]
        },
        standard: {
            inputRange: [0, 1],
            outputRange: [
                theme.color.convertHexToRGBA(theme.palette.primary.primary, 0),
                theme.color.convertHexToRGBA(theme.palette.primary.primary, 0)
            ]
        },
        tonal: {
            inputRange: [0, 1],
            outputRange: [
                disabledBackgroundColor,
                theme.color.convertHexToRGBA(
                    theme.palette.secondary.secondaryContainer,
                    1
                )
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
            borderColor: interpolateColor(
                border.value,
                [0, 1],
                [disabledBackgroundColor, theme.palette.outline.outline]
            )
        })
    }))

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {
            border,
            color,
            disabled,
            type
        })
    }, [animatedTiming, border, color, disabled, type])

    useEffect(
        () => () => {
            cancelAnimation(border)
            cancelAnimation(color)
        },
        [border, color]
    )

    return [contentAnimatedStyle]
}
