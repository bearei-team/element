import {useEffect} from 'react'
import {Animated, LayoutRectangle} from 'react-native'
import {useTheme} from 'styled-components/native'
import {
    AnimatedTiming,
    useAnimatedTiming
} from '../../../hooks/useAnimatedTiming'
import {useAnimatedValue} from '../../../hooks/useAnimatedValue'
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
    layout?: LayoutRectangle
    state: State
    trailingEventName: EventName
}

interface ProcessVisibleAnimatedOptions
    extends Pick<UseAnimatedOptions, 'visible' | 'onClosed'> {
    heightAnimated: Animated.Value
}

interface ProcessAddonAnimatedOptions
    extends Pick<UseAnimatedOptions, 'active'> {
    addonAfterAnimated: Animated.Value
    addonBeforeAnimated: Animated.Value
}

interface ProcessTrailingAnimatedTimingOptions extends UseAnimatedOptions {
    trailingAnimated: Animated.Value
}

const processVisibleAnimated = (
    animatedTiming: AnimatedTiming,
    {heightAnimated, onClosed, visible}: ProcessVisibleAnimatedOptions
) =>
    typeof visible === 'boolean' &&
    animatedTiming(heightAnimated, {toValue: visible ? 1 : 0}).start(
        ({finished}) => finished && !visible && onClosed?.()
    )

const processAddonAnimated = (
    animatedTiming: AnimatedTiming,
    {
        addonBeforeAnimated,
        addonAfterAnimated,
        active
    }: ProcessAddonAnimatedOptions
) => {
    const toValue = active ? 1 : 0

    typeof active === 'boolean' &&
        Animated.parallel([
            animatedTiming(addonBeforeAnimated, {toValue}),
            animatedTiming(addonAfterAnimated, {toValue})
        ]).start()
}

const processTrailingAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {
        closeIcon,
        eventName = 'none',
        state,
        trailingButton,
        trailingEventName,
        trailingAnimated
    }: ProcessTrailingAnimatedTimingOptions
) => {
    const toValue = state !== 'enabled' ? 1 : 0

    ;[trailingButton, closeIcon].includes(true) &&
        animatedTiming(trailingAnimated, {
            toValue:
                [eventName, trailingEventName].includes('hoverIn') ? 1 : toValue
        }).start()
}

export const useAnimated = ({
    active,
    closeIcon,
    eventName,
    itemGap = 0,
    layout = {} as LayoutRectangle,
    onClosed,
    state,
    trailingButton,
    trailingEventName,
    visible,
    addonAfterLayoutWidth = 0
}: UseAnimatedOptions) => {
    const {width: layoutWidth = 0, height: layoutHeight = 0} = layout
    const [heightAnimated] = useAnimatedValue(
        typeof visible === 'boolean' ?
            visible ? 1
            :   0
        :   1
    )
    const [trailingAnimated] = useAnimatedValue(trailingButton ? 0 : 1)
    const addonDefaultValue = active ? 1 : 0
    const [addonBeforeAnimated] = useAnimatedValue(addonDefaultValue)
    const [addonAfterAnimated] = useAnimatedValue(addonDefaultValue)
    const theme = useTheme()
    const [animatedTiming] = useAnimatedTiming(theme)
    const trailingOpacity = trailingAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
    })

    const height = heightAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, layoutHeight + itemGap]
    })

    const scaleX = addonAfterAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [1 - addonAfterLayoutWidth / layoutWidth, 1]
    })

    useEffect(() => {
        processTrailingAnimatedTiming(animatedTiming, {
            closeIcon,
            eventName,
            state,
            trailingButton,
            trailingEventName,
            trailingAnimated
        })

        return () => {
            trailingAnimated.stopAnimation()
        }
    }, [
        animatedTiming,
        closeIcon,
        eventName,
        state,
        trailingButton,
        trailingEventName,
        trailingAnimated
    ])

    useEffect(() => {
        processAddonAnimated(animatedTiming, {
            active,
            addonAfterAnimated,
            addonBeforeAnimated
        })

        return () => {
            addonBeforeAnimated.stopAnimation()
            addonAfterAnimated.stopAnimation()
        }
    }, [active, addonAfterAnimated, addonBeforeAnimated, animatedTiming])

    useEffect(() => {
        processVisibleAnimated(animatedTiming, {
            visible,
            heightAnimated,
            onClosed
        })

        return () => {
            heightAnimated.stopAnimation()
        }
    }, [animatedTiming, heightAnimated, onClosed, visible])

    return [{height, trailingOpacity, scaleX}]
}
