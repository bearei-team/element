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
    AnimatedTimingOptions,
    useAnimatedTiming
} from '../../../hooks/useAnimatedTiming'
import {RenderProps} from './SheetBase'

type UseAnimatedOptions = Pick<
    RenderProps,
    'visible' | 'sheetPosition' | 'type' | 'onClosed'
>
interface ScreenAnimatedOptions extends Pick<UseAnimatedOptions, 'onClosed'> {
    backgroundColor: SharedValue<AnimatableValue>
    innerTranslateX: SharedValue<AnimatableValue>
    width: SharedValue<AnimatableValue>
}

type ProcessAnimatedTimingOptions = ScreenAnimatedOptions &
    Pick<UseAnimatedOptions, 'visible'>

const enterScreen = (
    animatedTiming: AnimatedTiming,
    {backgroundColor, innerTranslateX, width}: ScreenAnimatedOptions
) => {
    const animatedTimingOptions = {
        duration: 'medium3',
        easing: 'emphasizedDecelerate',
        toValue: 1
    } as AnimatedTimingOptions

    animatedTiming(backgroundColor, animatedTimingOptions)
    animatedTiming(innerTranslateX, animatedTimingOptions)
    animatedTiming(width, animatedTimingOptions)
}

const exitScreen = (
    animatedTiming: AnimatedTiming,
    {backgroundColor, innerTranslateX, width, onClosed}: ScreenAnimatedOptions
) => {
    const animatedTimingOptions = {
        duration: 'short3',
        easing: 'emphasizedAccelerate',
        toValue: 0
    } as AnimatedTimingOptions

    animatedTiming(backgroundColor, animatedTimingOptions)
    animatedTiming(innerTranslateX, animatedTimingOptions)
    animatedTiming(width, animatedTimingOptions, onClosed)
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {
        backgroundColor,
        innerTranslateX,
        visible,
        width,
        onClosed
    }: ProcessAnimatedTimingOptions
) => {
    if (typeof visible !== 'boolean') {
        return
    }

    const screenAnimatedOptions = {
        backgroundColor,
        innerTranslateX,
        width
    }

    visible ?
        enterScreen(animatedTiming, screenAnimatedOptions)
    :   exitScreen(animatedTiming, {...screenAnimatedOptions, onClosed})
}

export const useAnimated = ({
    visible,
    sheetPosition,
    type,
    onClosed
}: UseAnimatedOptions) => {
    const animatedValue = visible ? 1 : 0
    const backgroundColor = useSharedValue(animatedValue)
    const width = useSharedValue(animatedValue)
    const innerTranslateX = useSharedValue(animatedValue)
    const theme = useTheme()
    const [animatedTiming] = useAnimatedTiming(theme)
    const contentAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            backgroundColor.value,
            [0, 1],
            [
                theme.color.convertHexToRGBA(theme.palette.scrim.scrim, 0),
                type === 'standard' ?
                    theme.color.convertHexToRGBA(theme.palette.scrim.scrim, 0)
                :   theme.color.convertHexToRGBA(
                        theme.palette.scrim.scrim,
                        0.32
                    )
            ]
        ),
        ...(type === 'standard' && {
            width: interpolate(
                width.value,
                [0, 1],
                [
                    0,
                    theme.adaptSize(
                        theme.spacing.small * 40 + theme.spacing.medium
                    )
                ]
            )
        })
    }))

    const innerAnimatedStyle = useAnimatedStyle(() => ({
        ...(type === 'modal' && {
            transform: [
                {
                    translateX: interpolate(
                        innerTranslateX.value,
                        [0, 1],
                        [
                            sheetPosition === 'horizontalEnd' ?
                                theme.adaptSize(theme.spacing.small * 40)
                            :   -theme.adaptSize(theme.spacing.small * 40),
                            theme.adaptSize(theme.spacing.none)
                        ]
                    )
                }
            ]
        })
    }))

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {
            backgroundColor,
            innerTranslateX,
            onClosed,
            visible,
            width
        })

        return () => {
            cancelAnimation(backgroundColor)
            cancelAnimation(innerTranslateX)
            cancelAnimation(width)
        }
    }, [
        animatedTiming,
        backgroundColor,
        onClosed,
        innerTranslateX,
        visible,
        width
    ])

    return [{contentAnimatedStyle, innerAnimatedStyle}]
}
