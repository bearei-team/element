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
import {EventName, State} from '../../Common/interface'
import {RenderProps} from './ListItemBase'

interface UseAnimatedOptions
    extends Pick<
        RenderProps,
        'trailingButton' | 'itemGap' | 'closeIcon' | 'visible' | 'onClosed'
    > {
    active?: boolean
    addonAfterLayoutWidth?: number
    addonBeforeLayoutWidth?: number
    eventName: EventName
    layoutHeight?: number
    state: State
    trailingEventName: EventName
}

interface ProcessVisibleAnimatedOptions
    extends Pick<UseAnimatedOptions, 'visible' | 'onClosed'> {
    height: SharedValue<AnimatableValue>
}

interface ProcessActiveAnimatedOptions
    extends Pick<UseAnimatedOptions, 'active'> {
    contentTranslateX: SharedValue<AnimatableValue>
}

interface ProcessTrailingAnimatedTimingOptions extends UseAnimatedOptions {
    trailingOpacity: SharedValue<AnimatableValue>
}

const processVisibleAnimated = (
    animatedTiming: AnimatedTiming,
    {height, onClosed, visible}: ProcessVisibleAnimatedOptions
) =>
    typeof visible === 'boolean' &&
    animatedTiming(
        height,
        {toValue: visible ? 1 : 0},
        finished => finished && !visible && onClosed?.()
    )

const processActiveAnimated = (
    animatedTiming: AnimatedTiming,
    {contentTranslateX, active}: ProcessActiveAnimatedOptions
) =>
    typeof active === 'boolean' &&
    animatedTiming(contentTranslateX, {toValue: active ? 1 : 0})

const processTrailingAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {
        closeIcon,
        eventName = 'none',
        state,
        trailingButton,
        trailingEventName,
        trailingOpacity
    }: ProcessTrailingAnimatedTimingOptions
) => {
    const toValue = state !== 'enabled' ? 1 : 0

    ;[trailingButton, closeIcon].includes(true) &&
        animatedTiming(trailingOpacity, {
            toValue:
                [eventName, trailingEventName].includes('hoverIn') ? 1 : toValue
        })
}

export const useAnimated = ({
    active,
    closeIcon,
    eventName,
    itemGap = 0,
    layoutHeight = 0,
    onClosed,
    state,
    trailingButton,
    trailingEventName,
    visible,
    addonAfterLayoutWidth = 0
}: UseAnimatedOptions) => {
    const visibleValue = visible ? 1 : 0
    const height = useSharedValue(
        typeof visible === 'boolean' ? visibleValue : 1
    )

    const trailingOpacity = useSharedValue(trailingButton ? 0 : 1)
    const contentTranslateX = useSharedValue(0)
    const theme = useTheme()
    const [animatedTiming] = useAnimatedTiming(theme)
    const containerAnimatedStyle = useAnimatedStyle(() => ({
        height: interpolate(height.value, [0, 1], [0, layoutHeight + itemGap])
    }))

    const trailingAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(height.value, [0, 1], [0, 1])
    }))

    const mainAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: interpolate(
                    contentTranslateX.value,
                    [0, 1],
                    [0, -addonAfterLayoutWidth]
                )
            }
        ]
    }))

    useEffect(() => {
        processTrailingAnimatedTiming(animatedTiming, {
            closeIcon,
            eventName,
            state,
            trailingButton,
            trailingEventName,
            trailingOpacity
        })

        return () => {
            cancelAnimation(trailingOpacity)
        }
    }, [
        animatedTiming,
        closeIcon,
        eventName,
        state,
        trailingButton,
        trailingEventName,
        trailingOpacity
    ])

    useEffect(() => {
        processVisibleAnimated(animatedTiming, {
            visible,
            height,
            onClosed
        })

        return () => {
            cancelAnimation(height)
        }
    }, [animatedTiming, height, onClosed, visible])

    useEffect(() => {
        processActiveAnimated(animatedTiming, {contentTranslateX, active})

        return () => {
            cancelAnimation(contentTranslateX)
        }
    }, [active, animatedTiming, contentTranslateX])

    return [{containerAnimatedStyle, trailingAnimatedStyle, mainAnimatedStyle}]
}
