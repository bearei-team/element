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
    animatedTiming(
        width,
        animatedTimingOptions,
        finished => finished && onClosed?.()
    )
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
    const contentBackgroundColorOutputRange = [
        theme.color.convertHexToRGBA(theme.palette.scrim.scrim, 0),
        type === 'standard' ?
            theme.color.convertHexToRGBA(theme.palette.scrim.scrim, 0)
        :   theme.color.convertHexToRGBA(theme.palette.scrim.scrim, 0.32)
    ]

    const contentWidthOutputRange = [
        0,
        theme.adaptSize(theme.spacing.small * 40 + theme.spacing.medium)
    ]

    const contentAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            backgroundColor.value,
            [0, 1],
            contentBackgroundColorOutputRange
        ),
        ...(type === 'standard' && {
            width: interpolate(width.value, [0, 1], contentWidthOutputRange)
        })
    }))

    const innerTranslateXOutputRange = [
        sheetPosition === 'horizontalEnd' ?
            theme.adaptSize(theme.spacing.small * 40)
        :   -theme.adaptSize(theme.spacing.small * 40),
        theme.adaptSize(theme.spacing.none)
    ]

    const innerAnimatedStyle = useAnimatedStyle(() => ({
        ...(type === 'modal' && {
            transform: [
                {
                    translateX: interpolate(
                        innerTranslateX.value,
                        [0, 1],
                        innerTranslateXOutputRange
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
    }, [
        animatedTiming,
        backgroundColor,
        onClosed,
        innerTranslateX,
        visible,
        width
    ])

    useEffect(
        () => () => {
            cancelAnimation(backgroundColor)
            cancelAnimation(innerTranslateX)
            cancelAnimation(width)
        },
        [backgroundColor, innerTranslateX, width]
    )

    return [{contentAnimatedStyle, innerAnimatedStyle}]
}
