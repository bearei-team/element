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
    afterAffordanceLayoutWidth?: number
    beforeAffordanceLayoutWidth?: number
    eventName: EventName
    innerLayoutHeight?: number
    state: State
    trailingEventName: EventName
}

interface ProcessVisibleAnimatedOptions
    extends Pick<UseAnimatedOptions, 'visible' | 'onClosed'> {
    height: SharedValue<AnimatableValue>
}

interface ProcessActiveAnimatedOptions
    extends Pick<UseAnimatedOptions, 'active'> {
    innerTranslateX: SharedValue<AnimatableValue>
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
    {innerTranslateX, active}: ProcessActiveAnimatedOptions
) =>
    typeof active === 'boolean' &&
    animatedTiming(innerTranslateX, {toValue: active ? 1 : 0})

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
    innerLayoutHeight = 0,
    onClosed,
    state,
    trailingButton,
    trailingEventName,
    visible,
    afterAffordanceLayoutWidth = 0
}: UseAnimatedOptions) => {
    const visibleValue = visible ? 1 : 0
    const height = useSharedValue(
        typeof visible === 'boolean' ? visibleValue : 1
    )

    const trailingOpacity = useSharedValue(trailingButton ? 0 : 1)
    const innerTranslateX = useSharedValue(0)
    const theme = useTheme()
    const [animatedTiming] = useAnimatedTiming(theme)
    const containerAnimatedStyle = useAnimatedStyle(() => ({
        ...(innerLayoutHeight !== 0 && {
            height: interpolate(
                height.value,
                [0, 1],
                [0, innerLayoutHeight + itemGap]
            )
        })
    }))

    const trailingAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(height.value, [0, 1], [0, 1])
    }))

    /**
     * FIXME:
     * The transform property in react-native-macos 0.72.* has
     * various bugs that cause problems when using transform to
     * implement offsets. Here is a temporary implementation using
     * left.
     *
     * Original realization:
     * @example
     * ```ts
     *   transform: [
     *      {
     *          translateX: interpolate(
     *              innerTranslateX.value,
     *              [0, 1],
     *              [0, -afterAffordanceLayoutWidth]
     *          )
     *      }
     * ]
     * ```
     */
    const innerAnimatedStyle = useAnimatedStyle(() => ({
        left: interpolate(
            innerTranslateX.value,
            [0, 1],
            [0, -afterAffordanceLayoutWidth]
        )
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
    }, [animatedTiming, height, onClosed, visible])

    useEffect(() => {
        processActiveAnimated(animatedTiming, {innerTranslateX, active})
    }, [active, animatedTiming, innerTranslateX])

    useEffect(
        () => () => {
            cancelAnimation(trailingOpacity)
            cancelAnimation(innerTranslateX)
            cancelAnimation(height)
        },
        [height, innerTranslateX, trailingOpacity]
    )

    return [{containerAnimatedStyle, trailingAnimatedStyle, innerAnimatedStyle}]
}
