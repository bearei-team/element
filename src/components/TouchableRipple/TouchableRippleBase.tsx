import {
    RefAttributes,
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useImperativeHandle,
    useMemo,
    useRef
} from 'react'
import {
    GestureResponderEvent,
    PressableProps,
    View,
    ViewProps
} from 'react-native'
import {Updater, useImmer} from 'use-immer'
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent'
import {ShapeProps} from '../Common/Common.styles'
import {EventName, State} from '../Common/interface'
import {Ripple, RippleProps} from './Ripple/Ripple'

type TouchableProps = PressableProps &
    Pick<
        RippleProps,
        'underlayColor' | 'centered' | 'active' | 'touchableLocation'
    > &
    Pick<ShapeProps, 'shape'> &
    RefAttributes<View> &
    ViewProps

export interface TouchableRippleProps
    extends Omit<TouchableProps, 'children' | 'disabled' | 'hitSlop'> {
    block?: boolean
    children?: React.JSX.Element
    defaultActive?: boolean
    disabled?: boolean
}

export interface RenderProps extends Omit<TouchableRippleProps, 'centered'> {
    onEvent: OnEvent
    ripples: React.JSX.Element | React.JSX.Element[]
}

interface TouchableRippleBaseProps extends TouchableRippleProps {
    render: (props: RenderProps) => React.JSX.Element
}

export type ExitAnimated = (finished?: () => void) => void
interface Ripple extends Pick<RippleProps, 'touchableLocation'> {
    exitAnimated?: ExitAnimated
}

type RippleSequence = Record<string, Ripple>
interface InitialState {
    rippleSequence: RippleSequence
}

interface ProcessEventOptions {
    setState: Updater<InitialState>
}

type ProcessActiveOptions = Pick<RenderProps, 'active' | 'touchableLocation'> &
    ProcessEventOptions

type ProcessAddRippleOptions = ProcessEventOptions &
    Pick<RenderProps, 'active' | 'touchableLocation'>

type ProcessEntryAnimatedFinishedOptions = ProcessEventOptions & {
    exitAnimated: ExitAnimated
}
type ProcessPressOutOptions = Omit<
    ProcessAddRippleOptions,
    'locationX' | 'locationY'
>
type ProcessStateChangeOptions = ProcessPressOutOptions & OnStateChangeOptions
type RenderRipplesOptions = Omit<RippleProps, 'sequence'> & {
    containerRef?: React.RefObject<View>
}

const processAddRipple = ({
    active,
    touchableLocation,
    setState
}: ProcessAddRippleOptions) => {
    setState(draft => {
        const keys = Object.keys(draft.rippleSequence)
        const exist = typeof active === 'boolean' && keys.length !== 0

        if (exist) {
            draft.rippleSequence = {
                [keys[0]]: {...draft.rippleSequence[keys[0]], touchableLocation}
            }

            return
        }

        draft.rippleSequence[
            `${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
        ] = {
            exitAnimated: undefined,
            touchableLocation
        }
    })
}

const processPressOut = (
    event: GestureResponderEvent,
    {active, setState}: ProcessPressOutOptions
) => {
    const {locationX, locationY} = event.nativeEvent

    typeof active !== 'boolean' &&
        processAddRipple({setState, touchableLocation: {locationX, locationY}})
}

const processStateChange = ({
    event,
    eventName,
    setState,
    active
}: ProcessStateChangeOptions) => {
    const nextEvent = {
        pressOut: () =>
            processPressOut(event as GestureResponderEvent, {setState, active})
    } as Record<EventName, () => void>

    nextEvent[eventName]?.()
}

const processEntryAnimatedFinished = (
    sequence: string,
    {setState, exitAnimated}: ProcessEntryAnimatedFinishedOptions
) =>
    exitAnimated(() =>
        setState(draft => {
            draft.rippleSequence[sequence] &&
                delete draft.rippleSequence[sequence]
        })
    )

const processActive = ({
    active,
    setState,
    touchableLocation
}: ProcessActiveOptions) =>
    typeof active === 'boolean' &&
    processAddRipple({touchableLocation, active, setState})

const renderRipples = (
    rippleSequence: RippleSequence,
    {centered, containerRef, ...props}: RenderRipplesOptions
) =>
    Object.entries(rippleSequence).map(([sequence, {touchableLocation}]) => (
        <Ripple
            {...props}
            centered={
                typeof centered === 'boolean' ? centered : (
                    !touchableLocation?.locationX
                )
            }
            containerCurrent={containerRef?.current}
            key={sequence}
            sequence={sequence}
            touchableLocation={touchableLocation}
        />
    ))

export const TouchableRippleBase = forwardRef<View, TouchableRippleBaseProps>(
    (
        {
            active: activeSource,
            centered,
            defaultActive,
            disabled,
            render,
            touchableLocation,
            underlayColor,
            ...renderProps
        },
        ref
    ) => {
        const [{rippleSequence}, setState] = useImmer<InitialState>({
            rippleSequence: {} as RippleSequence
        })

        const id = useId()
        const containerRef = useRef<View>(null)
        const active = activeSource ?? defaultActive
        const onStateChange = useCallback(
            (_state: State, options = {} as OnStateChangeOptions) =>
                processStateChange({...options, setState, active}),
            [active, setState]
        )

        const [onEvent] = useOnEvent({...renderProps, disabled, onStateChange})
        const onEntryAnimatedFinished = useCallback(
            (sequence: string, exitAnimated: ExitAnimated) =>
                processEntryAnimatedFinished(sequence, {
                    exitAnimated,
                    setState
                }),
            [setState]
        )

        const ripples = useMemo(
            () =>
                renderRipples(rippleSequence, {
                    active,
                    centered,
                    containerRef,
                    onEntryAnimatedFinished,
                    underlayColor
                }),
            [
                active,
                centered,
                onEntryAnimatedFinished,
                rippleSequence,
                underlayColor
            ]
        )

        useImperativeHandle(
            ref,
            () => (containerRef?.current ? containerRef?.current : {}) as View,
            []
        )

        useEffect(() => {
            processActive({active, setState, touchableLocation})
        }, [active, setState, touchableLocation])

        return render({
            ...renderProps,
            id,
            onEvent,
            ref: containerRef,
            ripples
        })
    }
)
