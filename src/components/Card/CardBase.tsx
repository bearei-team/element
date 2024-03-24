import {forwardRef, useCallback, useEffect, useId, useMemo} from 'react'
import {GestureResponderEvent, TextStyle, View, ViewStyle} from 'react-native'
import {AnimatedStyle} from 'react-native-reanimated'
import {Updater, useImmer} from 'use-immer'
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent'
import {Button} from '../Button/Button'
import {ComponentStatus, EventName, State} from '../Common/interface'
import {ElevationLevel} from '../Elevation/Elevation'
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple'
import {useAnimated} from './useAnimated'
import {useBorder} from './useBorder'
import {useUnderlayColor} from './useUnderlayColor'

type CardType = 'elevated' | 'filled' | 'outlined'
export interface CardProps extends TouchableRippleProps {
    block?: boolean
    footer?: boolean
    onPrimaryButtonPress?: (event: GestureResponderEvent) => void
    onSecondaryButtonPress?: (event: GestureResponderEvent) => void
    primaryButton?: React.JSX.Element
    primaryButtonLabelText?: string
    secondaryButton?: React.JSX.Element
    secondaryButtonLabelText?: string
    subheadText?: string
    subheadTitleText?: string
    supportingText?: string
    titleText?: string
    type?: CardType
}

export interface RenderProps extends CardProps {
    elevation: ElevationLevel
    eventName: EventName
    onEvent: OnEvent
    renderStyle: AnimatedStyle<ViewStyle> & {
        contentAnimatedStyle: AnimatedStyle<ViewStyle>
        subheadTextAnimatedStyle: AnimatedStyle<TextStyle>
        titleTextAnimatedStyle: AnimatedStyle<TextStyle>
    }
}

interface CardBaseProps extends CardProps {
    render: (props: RenderProps) => React.JSX.Element
}

interface InitialState {
    elevation?: ElevationLevel
    eventName: EventName
    status: ComponentStatus
}

interface ProcessEventOptions {
    setState: Updater<InitialState>
}

type ProcessElevationOptions = Pick<RenderProps, 'type'> & ProcessEventOptions
type ProcessInitOptions = Pick<RenderProps, 'type' | 'disabled'> &
    ProcessEventOptions
type ProcessStateChangeOptions = OnStateChangeOptions & ProcessElevationOptions

const processCorrectionCoefficient = ({type}: Pick<RenderProps, 'type'>) =>
    type === 'elevated' ? 1 : 0

const processElevation = (
    state: State,
    {type = 'filled', setState}: ProcessElevationOptions
) => {
    if (!['elevated', 'filled', 'tonal'].includes(type)) {
        return
    }

    const level = {
        disabled: 0,
        enabled: 0,
        error: 0,
        focused: 0,
        hovered: 1,
        longPressIn: 0,
        pressIn: 0
    }

    const correctionCoefficient = processCorrectionCoefficient({type})

    setState(draft => {
        draft.elevation = (
            state === 'disabled' ?
                level[state]
            :   level[state] + correctionCoefficient) as ElevationLevel
    })
}

/**
 * FIXME:
 *
 * Handles the problem of cards accidentally coming into focus when using primary or secondary
 * buttons.
 */
const processStateChange = (
    state: State,
    {eventName, type, setState}: ProcessStateChangeOptions
) => {
    if (eventName === 'layout') {
        return
    }

    processElevation(state, {type, setState})
    setState(draft => {
        draft.eventName = eventName
    })
}

const processInit = ({type, setState, disabled}: ProcessInitOptions) =>
    setState(draft => {
        if (draft.status !== 'idle') {
            return
        }

        type === 'elevated' && !disabled && (draft.elevation = 1)
        draft.status = 'succeeded'
    })

const processDisabledElevation = (
    {type, setState}: ProcessInitOptions,
    disabled?: boolean
) =>
    typeof disabled === 'boolean' &&
    type === 'elevated' &&
    setState(draft => {
        draft.status === 'succeeded' && (draft.elevation = disabled ? 0 : 1)
    })

const processDisabled = ({setState}: ProcessEventOptions, disabled?: boolean) =>
    disabled &&
    setState(draft => {
        draft.status === 'succeeded' && (draft.eventName = 'none')
    })

export const CardBase = forwardRef<View, CardBaseProps>(
    (
        {
            disabled,
            onPrimaryButtonPress,
            onSecondaryButtonPress,
            primaryButton,
            primaryButtonLabelText = 'Save',
            render,
            secondaryButton,
            secondaryButtonLabelText = 'Cancel',
            titleText = 'Title',
            type = 'filled',
            ...renderProps
        },
        ref
    ) => {
        const [{elevation, eventName, status}, setState] =
            useImmer<InitialState>({
                elevation: undefined,
                eventName: 'none',
                status: 'idle'
            })

        const id = useId()
        const [underlayColor] = useUnderlayColor({type})
        const onStateChange = useCallback(
            (state: State, options = {} as OnStateChangeOptions) =>
                processStateChange(state, {...options, type, setState}),
            [setState, type]
        )

        const [onEvent] = useOnEvent({...renderProps, disabled, onStateChange})
        const [
            {
                contentAnimatedStyle,
                subheadTextAnimatedStyle,
                titleTextAnimatedStyle
            }
        ] = useAnimated({
            disabled,
            eventName,
            type
        })

        const [border] = useBorder({type})
        const primaryButtonElement = useMemo(
            () =>
                primaryButton ?? (
                    <Button
                        disabled={disabled}
                        labelText={primaryButtonLabelText}
                        onPress={onPrimaryButtonPress}
                        type='filled'
                    />
                ),
            [
                disabled,
                onPrimaryButtonPress,
                primaryButton,
                primaryButtonLabelText
            ]
        )

        const secondaryButtonElement = useMemo(
            () =>
                secondaryButton ?? (
                    <Button
                        disabled={disabled}
                        labelText={secondaryButtonLabelText}
                        onPress={onSecondaryButtonPress}
                        type='outlined'
                    />
                ),
            [
                disabled,
                onSecondaryButtonPress,
                secondaryButton,
                secondaryButtonLabelText
            ]
        )

        useEffect(() => {
            processInit({setState, type, disabled})
            processDisabled({setState}, disabled)
            processDisabledElevation({setState, type}, disabled)
        }, [disabled, setState, type])

        if (status === 'idle') {
            return <></>
        }

        return render({
            ...renderProps,
            disabled,
            elevation,
            eventName,
            id,
            onEvent,
            primaryButton: primaryButtonElement,
            ref,
            secondaryButton: secondaryButtonElement,
            titleText,
            type,
            underlayColor,
            renderStyle: {
                ...border,
                contentAnimatedStyle,
                subheadTextAnimatedStyle,
                titleTextAnimatedStyle
            }
        })
    }
)
