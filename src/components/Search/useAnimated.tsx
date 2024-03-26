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
import {AnimatedTiming, useAnimatedTiming} from '../../hooks/useAnimatedTiming'

interface UseAnimatedOptions {
    listVisible?: boolean
    onListClosed: (visible?: boolean) => void
}

interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    listHeight: SharedValue<AnimatableValue>
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {listHeight, listVisible, onListClosed}: ProcessAnimatedTimingOptions
) =>
    animatedTiming(
        listHeight,
        {toValue: listVisible ? 1 : 0},
        finished => finished && !listVisible && onListClosed(listVisible)
    )

export const useAnimated = ({
    listVisible,
    onListClosed
}: UseAnimatedOptions) => {
    const listHeight = useSharedValue(listVisible ? 1 : 0)
    const theme = useTheme()
    const [animatedTiming] = useAnimatedTiming(theme)
    const listHeightOutputRange = [0, theme.adaptSize(theme.spacing.small * 40)]
    const listAnimatedStyle = useAnimatedStyle(() => ({
        height: interpolate(listHeight.value, [0, 1], listHeightOutputRange)
    }))

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {
            listHeight,
            listVisible,
            onListClosed
        })
    }, [animatedTiming, listHeight, listVisible, onListClosed])

    useEffect(
        () => () => {
            cancelAnimation(listHeight)
        },
        [listHeight]
    )

    return [listAnimatedStyle]
}
