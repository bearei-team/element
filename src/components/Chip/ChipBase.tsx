import {forwardRef, useCallback, useEffect, useId} from 'react'
import {
    GestureResponderEvent,
    NativeTouchEvent,
    TextStyle,
    View,
    ViewStyle
} from 'react-native'
import {AnimatedStyle} from 'react-native-reanimated'
import {useTheme} from 'styled-components/native'
import {Updater, useImmer} from 'use-immer'
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent'
import {ComponentStatus, EventName, State} from '../Common/interface'
import {ElevationLevel} from '../Elevation/Elevation'
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple'
import {useAnimated} from './useAnimated'
import {useBorder} from './useBorder'
import {useIcon} from './useIcon'
import {useUnderlayColor} from './useUnderlayColor'

type ChipType = 'input' | 'assist' | 'filter' | 'suggestion'
export interface ChipProps extends TouchableRippleProps {
    active?: boolean
    block?: boolean
    defaultActive?: boolean
    elevated?: boolean
    fill?: string
    icon?: React.JSX.Element
    labelText?: string
    trailingIcon?: React.JSX.Element
    type?: ChipType
}

export interface RenderProps extends ChipProps {
    activeColor: string
    elevation: ElevationLevel
    eventName: EventName
    onEvent: OnEvent
    renderStyle: {
        contentAnimatedStyle: AnimatedStyle<ViewStyle>
        labelTextAnimatedStyle: AnimatedStyle<TextStyle>
    }
    touchableLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>
}

interface ChipBaseProps extends ChipProps {
    render: (props: RenderProps) => React.JSX.Element
}

interface InitialState {
    active?: boolean
    elevation?: ElevationLevel
    eventName: EventName
    status: ComponentStatus
    touchableLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>
}

interface ProcessEventOptions {
    setState: Updater<InitialState>
}

type ProcessActiveOptions = Pick<RenderProps, 'active'> & ProcessEventOptions
type ProcessDisabledElevationOptions = Pick<RenderProps, 'elevated'> &
    ProcessEventOptions
type ProcessElevationOptions = Pick<RenderProps, 'elevated'> &
    ProcessEventOptions
type ProcessInitOptions = Pick<
    RenderProps,
    'elevated' | 'active' | 'disabled'
> &
    ProcessEventOptions

type ProcessPressOutOptions = ProcessEventOptions
type ProcessStateChangeOptions = OnStateChangeOptions & ProcessElevationOptions

const processCorrectionCoefficient = ({
    elevated
}: Pick<RenderProps, 'elevated'>) => (elevated ? 1 : 0)

const processElevation = (
    state: State,
    {elevated, setState}: ProcessElevationOptions
) => {
    if (!elevated) {
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

    const correctionCoefficient = processCorrectionCoefficient({elevated})

    setState(draft => {
        draft.elevation = (
            state === 'disabled' ?
                level[state]
            :   level[state] + correctionCoefficient) as ElevationLevel
    })
}

const processPressOut = (
    event: GestureResponderEvent,
    {setState}: ProcessPressOutOptions
) => {
    const {locationX = 0, locationY = 0} = event.nativeEvent

    setState(draft => {
        if (typeof draft.active !== 'boolean') {
            return
        }

        !draft.active && (draft.touchableLocation = {locationX, locationY})
    })
}

const processStateChange = (
    state: State,
    {event, eventName, elevated, setState}: ProcessStateChangeOptions
) => {
    if (eventName === 'layout') {
        return
    }

    const nextEvent = {
        pressOut: () =>
            processPressOut(event as GestureResponderEvent, {setState})
    } as Record<EventName, () => void>

    nextEvent[eventName]?.()
    processElevation(state, {elevated, setState})
    setState(draft => {
        draft.eventName = eventName
    })
}

const processInit = ({elevated, setState, disabled}: ProcessInitOptions) =>
    setState(draft => {
        if (draft.status !== 'idle') {
            return
        }

        elevated && !disabled && (draft.elevation = 1)
        draft.status = 'succeeded'
    })

const processDisabledElevation = (
    {elevated, setState}: ProcessDisabledElevationOptions,
    disabled?: boolean
) =>
    typeof disabled === 'boolean' &&
    elevated &&
    setState(draft => {
        draft.elevation = disabled ? 0 : 1
    })

const processDisabled = ({setState}: ProcessEventOptions, disabled?: boolean) =>
    disabled &&
    setState(draft => {
        draft.eventName = 'none'
    })

const processActive = ({active, setState}: ProcessActiveOptions) => {
    typeof active === 'boolean' &&
        setState(draft => {
            if (draft.active === active) {
                return
            }

            draft.active = active
        })
}

export const ChipBase = forwardRef<View, ChipBaseProps>(
    (
        {
            active: activeSource,
            defaultActive,
            disabled,
            elevated = false,
            fill,
            icon,
            labelText = 'Label',
            render,
            type = 'filter',
            ...renderProps
        },
        ref
    ) => {
        const [
            {active, touchableLocation, elevation, eventName, status},
            setState
        ] = useImmer<InitialState>({
            active: undefined,
            elevation: undefined,
            eventName: 'none',
            status: 'idle',
            touchableLocation: undefined
        })

        const theme = useTheme()
        const id = useId()
        const [underlayColor] = useUnderlayColor({type, elevated})
        const activeColor = theme.palette.secondary.secondaryContainer
        const onStateChange = useCallback(
            (state: State, options = {} as OnStateChangeOptions) =>
                processStateChange(state, {...options, elevated, setState}),
            [setState, elevated]
        )

        const [onEvent] = useOnEvent({...renderProps, disabled, onStateChange})
        const [{contentAnimatedStyle, labelTextAnimatedStyle}] = useAnimated({
            disabled,
            eventName,
            type
        })

        const [iconElement] = useIcon({eventName, type, icon, disabled, fill})
        const [border] = useBorder({elevated})

        useEffect(() => {
            processInit({elevated, setState})
            processDisabled({setState}, disabled)
            processDisabledElevation({elevated, setState}, disabled)
        }, [disabled, elevated, setState])

        useEffect(() => {
            processActive({
                active: activeSource ?? defaultActive,
                setState
            })
        }, [activeSource, defaultActive, setState])

        if (status === 'idle') {
            return <></>
        }

        return render({
            ...renderProps,
            active,
            activeColor,
            disabled,
            elevation,
            eventName,
            icon: iconElement,
            id,
            labelText,
            onEvent,
            ref,
            renderStyle: {
                ...border,
                contentAnimatedStyle,
                labelTextAnimatedStyle
            },
            touchableLocation,
            type,
            underlayColor
        })
    }
)
