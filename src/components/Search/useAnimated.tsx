import {useEffect, useMemo} from 'react'
import {Animated} from 'react-native'
import {useTheme} from 'styled-components/native'
import {AnimatedTiming, useAnimatedTiming} from '../../hooks/useAnimatedTiming'
import {useAnimatedValue} from '../../hooks/useAnimatedValue'

interface UseAnimatedOptions {
    listVisible?: boolean
    onListClosed: (visible?: boolean) => void
}

interface ProcessAnimatedTimingOptions extends UseAnimatedOptions {
    listHeightAnimated: Animated.Value
}

const processAnimatedTiming = (
    animatedTiming: AnimatedTiming,
    {
        listHeightAnimated,
        listVisible,
        onListClosed
    }: ProcessAnimatedTimingOptions
) =>
    animatedTiming(listHeightAnimated, {toValue: listVisible ? 1 : 0}).start(
        ({finished}) => finished && !listVisible && onListClosed(listVisible)
    )

export const useAnimated = ({
    listVisible,
    onListClosed
}: UseAnimatedOptions) => {
    const [listHeightAnimated] = useAnimatedValue(listVisible ? 1 : 0)
    const theme = useTheme()
    const [animatedTiming] = useAnimatedTiming(theme)
    const listHeight = useMemo(
        () =>
            listHeightAnimated.interpolate({
                inputRange: [0, 1],
                outputRange: [
                    theme.adaptSize(theme.spacing.none),
                    theme.adaptSize(theme.spacing.small * 40)
                ]
            }),
        [listHeightAnimated, theme]
    )

    useEffect(() => {
        processAnimatedTiming(animatedTiming, {
            listHeightAnimated,
            listVisible,
            onListClosed
        })

        return () => {
            listHeightAnimated.stopAnimation()
        }
    }, [animatedTiming, listHeightAnimated, listVisible, onListClosed])

    return [{listHeight}]
}
