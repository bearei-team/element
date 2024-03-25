import {useCallback, useEffect, useMemo} from 'react'
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
import {AnimatedTiming, useAnimatedTiming} from '../../hooks/useAnimatedTiming'
import {EventName, State} from '../Common/interface'
import {RenderProps} from './TextFieldBase'

interface UseAnimatedOptions
    extends Pick<RenderProps, 'type' | 'error' | 'disabled'> {
    eventName: EventName
    filled: boolean
    state: State
}

interface ProcessEnabledOptions extends Pick<UseAnimatedOptions, 'error'> {
    activeIndicatorScaleY: SharedValue<AnimatableValue>
    animatedTiming: AnimatedTiming
    color: SharedValue<AnimatableValue>
    filledToValue: number
    inputColor: SharedValue<AnimatableValue>
    labelText: SharedValue<AnimatableValue>
    supportingText: SharedValue<AnimatableValue>
}

interface ProcessDisabledOptions {
    activeIndicatorScaleY: SharedValue<AnimatableValue>
    animatedTiming: AnimatedTiming
    color: SharedValue<AnimatableValue>
    headerInnerBackgroundColor: SharedValue<AnimatableValue>
    inputColor: SharedValue<AnimatableValue>
    supportingText: SharedValue<AnimatableValue>
}

interface ProcessErrorOptions {
    activeIndicatorScaleY: SharedValue<AnimatableValue>
    animatedTiming: AnimatedTiming
    color: SharedValue<AnimatableValue>
    inputColor: SharedValue<AnimatableValue>
    supportingText: SharedValue<AnimatableValue>
}

interface ProcessFocusedOptions extends Pick<UseAnimatedOptions, 'error'> {
    activeIndicatorScaleY: SharedValue<AnimatableValue>
    animatedTiming: AnimatedTiming
    color: SharedValue<AnimatableValue>
    labelText: SharedValue<AnimatableValue>
}

interface ProcessStateAnimatedOptions {
    stateAnimated: Record<State, () => void | undefined | number>
}

type ProcessNonerrorAnimatedOptions = ProcessStateAnimatedOptions &
    Pick<UseAnimatedOptions, 'disabled' | 'error'>

type ProcessDisabledAnimatedOptions = ProcessStateAnimatedOptions &
    Pick<UseAnimatedOptions, 'disabled'>

const processEnabled = ({
    activeIndicatorScaleY,
    animatedTiming,
    color,
    error,
    filledToValue,
    inputColor,
    labelText,
    supportingText
}: ProcessEnabledOptions) => {
    if (error) {
        return animatedTiming(labelText, {toValue: filledToValue})
    }

    animatedTiming(activeIndicatorScaleY, {toValue: 0})
    animatedTiming(color, {toValue: 1})
    animatedTiming(inputColor, {toValue: 1})
    animatedTiming(labelText, {toValue: filledToValue})
    animatedTiming(supportingText, {toValue: 1})
}

const processDisabled = ({
    activeIndicatorScaleY,
    animatedTiming,
    color,
    headerInnerBackgroundColor,
    inputColor,
    supportingText
}: ProcessDisabledOptions) => {
    const toValue = 0

    animatedTiming(activeIndicatorScaleY, {toValue})
    animatedTiming(color, {toValue})
    animatedTiming(headerInnerBackgroundColor, {toValue})
    animatedTiming(inputColor, {toValue})
    animatedTiming(supportingText, {toValue})
}

const processError = ({
    activeIndicatorScaleY,
    animatedTiming,
    color,
    inputColor,
    supportingText
}: ProcessErrorOptions) => {
    animatedTiming(activeIndicatorScaleY, {toValue: 1})
    animatedTiming(color, {toValue: 3})
    animatedTiming(inputColor, {toValue: 1})
    animatedTiming(supportingText, {toValue: 2})
}

const processFocused = ({
    activeIndicatorScaleY,
    animatedTiming,
    color,
    error,
    labelText
}: ProcessFocusedOptions) => {
    if (error) {
        return animatedTiming(labelText, {toValue: 0})
    }

    animatedTiming(activeIndicatorScaleY, {toValue: 1})
    animatedTiming(color, {toValue: 2})
    animatedTiming(labelText, {toValue: 0})
}

const processStateAnimated = (
    state: State,
    {stateAnimated}: ProcessStateAnimatedOptions
) => stateAnimated[state]?.()

const processNonerrorAnimated = (
    state: State,
    {stateAnimated, error, disabled}: ProcessNonerrorAnimatedOptions
) => {
    const nonerror = typeof error !== 'boolean' && disabled

    !nonerror && stateAnimated[error ? 'error' : state]?.()
}

const processDisabledAnimated = (
    state: State,
    {stateAnimated, disabled}: ProcessDisabledAnimatedOptions
) =>
    typeof disabled === 'boolean' &&
    stateAnimated[disabled ? 'disabled' : state]?.()

export const useAnimated = ({
    disabled,
    error,
    filled,
    state,
    type = 'filled'
}: UseAnimatedOptions) => {
    const theme = useTheme()
    const disabledAnimatedValue = disabled ? 0 : 1
    const defaultAnimatedValue = {
        activeIndicatorScaleY: error ? 1 : 0,
        color: error ? 3 : 1,
        inputColor: error ? 3 : 1,
        supportingText: error ? 2 : 1
    }

    const activeIndicatorScaleY = useSharedValue(
        disabled ?
            disabledAnimatedValue
        :   defaultAnimatedValue.activeIndicatorScaleY
    )

    const headerInnerBackgroundColor = useSharedValue(disabledAnimatedValue)
    const color = useSharedValue(
        disabled ? disabledAnimatedValue : defaultAnimatedValue.color
    )

    const inputColor = useSharedValue(
        disabled ? disabledAnimatedValue : defaultAnimatedValue.inputColor
    )

    const supportingText = useSharedValue(
        disabled ? disabledAnimatedValue : defaultAnimatedValue.supportingText
    )

    const [animatedTiming] = useAnimatedTiming(theme)
    const disabledBackgroundColor = theme.color.convertHexToRGBA(
        theme.palette.surface.onSurface,
        0.12
    )

    const disabledColor = theme.color.convertHexToRGBA(
        theme.palette.surface.onSurface,
        0.38
    )

    const filledToValue = filled ? 0 : 1
    const labelText = useSharedValue(filledToValue)
    const backgroundColorType = {
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
                theme.color.convertHexToRGBA(theme.palette.surface.surface, 0),
                theme.color.convertHexToRGBA(theme.palette.surface.surface, 0)
            ]
        }
    }

    const headerInnerAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            headerInnerBackgroundColor.value,
            backgroundColorType[type].inputRange,
            backgroundColorType[type].outputRange
        )
    }))

    const inputAnimatedStyle = useAnimatedStyle(() => ({
        color: interpolateColor(
            color.value,
            [0, 1],
            [
                disabledColor,
                theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 1)
            ]
        )
    }))

    const labelTextAnimatedStyle = useAnimatedStyle(() => ({
        fontSize: interpolate(
            labelText.value,
            [0, 1],
            [
                theme.adaptFontSize(theme.typography.body.small.size),
                theme.adaptFontSize(theme.typography.body.large.size)
            ]
        ),
        letterSpacing: interpolate(
            labelText.value,
            [0, 1],
            [
                theme.adaptFontSize(theme.typography.body.small.letterSpacing),
                theme.adaptFontSize(theme.typography.body.large.letterSpacing)
            ]
        ),
        height: interpolate(
            labelText.value,
            [0, 1],
            [
                theme.adaptFontSize(theme.typography.body.small.lineHeight),
                theme.adaptFontSize(theme.typography.body.large.lineHeight)
            ]
        ),
        lineHeight: interpolate(
            labelText.value,
            [0, 1],
            [
                theme.adaptFontSize(theme.typography.body.small.lineHeight),
                theme.adaptFontSize(theme.typography.body.large.lineHeight)
            ]
        ),
        color: interpolateColor(
            color.value,
            [0, 1, 2, 3],
            [
                disabledColor,
                theme.color.convertHexToRGBA(
                    theme.palette.surface.onSurfaceVariant,
                    1
                ),
                theme.color.convertHexToRGBA(theme.palette.primary.primary, 1),
                theme.color.convertHexToRGBA(theme.palette.error.error, 1)
            ]
        ),
        transform: [
            {
                translateY: interpolate(
                    labelText.value,
                    [0, 1],
                    [-theme.adaptSize(theme.spacing.small), 0]
                )
            }
        ]
    }))

    const activeIndicatorAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            color.value,
            [0, 1, 2, 3],
            [
                disabledColor,
                theme.color.convertHexToRGBA(
                    theme.palette.surface.onSurfaceVariant,
                    1
                ),
                theme.color.convertHexToRGBA(theme.palette.primary.primary, 1),
                theme.color.convertHexToRGBA(theme.palette.error.error, 1)
            ]
        ),
        height: interpolate(
            activeIndicatorScaleY.value,
            [0, theme.adaptSize(theme.spacing.extraSmall / 4)],
            [1, theme.adaptSize(theme.spacing.extraSmall / 2 + 1)]
        )
    }))

    const supportingTextAnimatedStyle = useAnimatedStyle(() => ({
        color: interpolateColor(
            supportingText.value,
            [0, 1, 2],
            [
                disabledColor,
                theme.color.convertHexToRGBA(
                    theme.palette.surface.onSurfaceVariant,
                    1
                ),
                theme.color.convertHexToRGBA(theme.palette.error.error, 1)
            ]
        )
    }))

    const processEnabledState = useCallback(
        () =>
            processEnabled({
                activeIndicatorScaleY,
                animatedTiming,
                color,
                error,
                filledToValue,
                inputColor,
                labelText,
                supportingText
            }),
        [
            activeIndicatorScaleY,
            animatedTiming,
            color,
            error,
            filledToValue,
            inputColor,
            labelText,
            supportingText
        ]
    )

    const processDisabledState = useCallback(
        () =>
            processDisabled({
                activeIndicatorScaleY,
                animatedTiming,
                headerInnerBackgroundColor,
                color,
                inputColor,
                supportingText
            }),
        [
            activeIndicatorScaleY,
            animatedTiming,
            headerInnerBackgroundColor,
            color,
            inputColor,
            supportingText
        ]
    )

    const processErrorState = useCallback(
        () =>
            processError({
                activeIndicatorScaleY,
                animatedTiming,
                color,
                inputColor,
                supportingText
            }),
        [
            activeIndicatorScaleY,
            animatedTiming,
            color,
            inputColor,
            supportingText
        ]
    )

    const processFocusedState = useCallback(
        () =>
            processFocused({
                activeIndicatorScaleY,
                animatedTiming,
                color,
                error,
                labelText
            }),
        [activeIndicatorScaleY, animatedTiming, color, error, labelText]
    )

    const stateAnimated = useMemo(
        () =>
            ({
                disabled: processDisabledState,
                enabled: processEnabledState,
                error: processErrorState,
                focused: processFocusedState
            }) as Record<State, () => void | undefined | number>,
        [
            processDisabledState,
            processEnabledState,
            processErrorState,
            processFocusedState
        ]
    )

    useEffect(() => {
        processStateAnimated(state, {stateAnimated})
        processNonerrorAnimated(state, {stateAnimated, disabled, error})
        processDisabledAnimated(state, {disabled, stateAnimated})

        return () => {
            cancelAnimation(activeIndicatorScaleY)
            cancelAnimation(headerInnerBackgroundColor)
            cancelAnimation(color)
            cancelAnimation(inputColor)
            cancelAnimation(labelText)
            cancelAnimation(supportingText)
        }
    }, [
        activeIndicatorScaleY,
        headerInnerBackgroundColor,
        color,
        disabled,
        error,
        inputColor,
        labelText,
        state,
        stateAnimated,
        supportingText
    ])

    return [
        {
            activeIndicatorAnimatedStyle,
            headerInnerAnimatedStyle,
            inputAnimatedStyle,
            labelTextAnimatedStyle,
            supportingTextAnimatedStyle
        }
    ]
}
