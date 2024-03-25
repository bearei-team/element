import {
    RefAttributes,
    cloneElement,
    forwardRef,
    useCallback,
    useId,
    useMemo
} from 'react'
import {
    GestureResponderEvent,
    NativeTouchEvent,
    PressableProps,
    TextStyle,
    View,
    ViewProps
} from 'react-native'
import {AnimatedStyle} from 'react-native-reanimated'
import {useTheme} from 'styled-components/native'
import {Updater, useImmer} from 'use-immer'
import {
    OnEvent,
    OnStateChangeOptions,
    useOnEvent
} from '../../../hooks/useOnEvent'
import {ShapeProps} from '../../Common/Common.styles'
import {EventName, State} from '../../Common/interface'
import {Icon, IconProps} from '../../Icon/Icon'
import {useAnimated} from './useAnimated'

export type NavigationRailType = 'segment' | 'block'
export interface NavigationRailItemProps
    extends Partial<
        ViewProps &
            RefAttributes<View> &
            Pick<ShapeProps, 'shape'> &
            PressableProps
    > {
    activeKey?: string
    dataKey?: string
    icon?: React.JSX.Element
    labelText?: string
    onActive?: (value?: string) => void
    type?: NavigationRailType
}

export interface RenderProps extends NavigationRailItemProps {
    active?: boolean
    activeColor: string
    eventName: EventName
    onEvent: OnEvent
    renderStyle: {labelTextAnimatedStyle: AnimatedStyle<TextStyle>}
    touchableLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>
    underlayColor: string
}

interface NavigationRailItemBaseProps extends NavigationRailItemProps {
    render: (props: RenderProps) => React.JSX.Element
}

export interface InitialState {
    eventName: EventName
    touchableLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>
}

interface ProcessEventOptions {
    setState: Updater<InitialState>
}

type ProcessPressOutOptions = Pick<
    RenderProps,
    'activeKey' | 'dataKey' | 'onActive'
> &
    ProcessEventOptions

type ProcessStateChangeOptions = OnStateChangeOptions & ProcessPressOutOptions

const processPressOut = (
    event: GestureResponderEvent,
    {dataKey, activeKey, onActive, setState}: ProcessPressOutOptions
) => {
    if (activeKey === dataKey) {
        return
    }

    const {locationX, locationY} = event.nativeEvent

    setState(draft => {
        draft.touchableLocation = {locationX, locationY}
    })

    onActive?.(dataKey)
}

const processStateChange = ({
    event,
    eventName,
    setState,
    activeKey,
    dataKey,
    onActive
}: ProcessStateChangeOptions) => {
    if (eventName === 'layout') {
        return
    }

    const nextEvent = {
        pressOut: () =>
            processPressOut(event as GestureResponderEvent, {
                activeKey,
                dataKey,
                onActive,
                setState
            })
    } as Record<EventName, () => void>

    nextEvent[eventName]?.()

    setState(draft => {
        draft.eventName = eventName
    })
}

export const NavigationRailItemBase = forwardRef<
    View,
    NavigationRailItemBaseProps
>(
    (
        {
            activeKey,
            dataKey,
            icon = <Icon name='circle' />,
            onActive,
            render,
            type = 'segment',
            ...renderProps
        },
        ref
    ) => {
        const [{eventName, touchableLocation}, setState] =
            useImmer<InitialState>({
                eventName: 'none',
                touchableLocation: {} as InitialState['touchableLocation']
            })

        const id = useId()
        const theme = useTheme()
        const activeColor = theme.palette.secondary.secondaryContainer
        const underlayColor = theme.palette.surface.onSurface
        const active = activeKey === dataKey
        const [labelTextAnimatedStyle] = useAnimated({active, type})
        const iconLayout = useMemo(
            () => ({
                width: theme.adaptSize(theme.spacing.large),
                height: theme.adaptSize(theme.spacing.large)
            }),
            [theme]
        )

        const onStateChange = useCallback(
            (_state: State, options = {} as OnStateChangeOptions) =>
                processStateChange({
                    ...options,
                    activeKey,
                    dataKey,
                    onActive,
                    setState
                }),
            [activeKey, dataKey, onActive, setState]
        )

        const [onEvent] = useOnEvent({
            ...renderProps,
            disabled: false,
            onStateChange
        })

        const iconElement = useMemo(
            () =>
                cloneElement<IconProps>(icon, {
                    renderStyle: {...iconLayout},
                    eventName,
                    type: active ? 'filled' : 'outlined'
                }),
            [active, eventName, icon, iconLayout]
        )

        return render({
            ...renderProps,
            active,
            activeColor,
            eventName,
            icon: iconElement,
            id,
            onEvent,
            ref,
            renderStyle: {labelTextAnimatedStyle},
            touchableLocation,
            type,
            underlayColor
        })
    }
)
