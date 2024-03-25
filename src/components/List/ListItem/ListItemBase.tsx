import React, {
    cloneElement,
    forwardRef,
    useCallback,
    useId,
    useMemo
} from 'react'
import {
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    NativeTouchEvent,
    View,
    ViewStyle
} from 'react-native'
import {AnimatedStyle} from 'react-native-reanimated'
import {DefaultTheme, useTheme} from 'styled-components/native'
import {Updater, useImmer} from 'use-immer'
import {
    OnEvent,
    OnStateChangeOptions,
    useOnEvent
} from '../../../hooks/useOnEvent'
import {ComponentStatus, EventName, Size, State} from '../../Common/interface'
import {Icon, IconName, IconType} from '../../Icon/Icon'
import {IconButton} from '../../IconButton/IconButton'
import {TouchableRippleProps} from '../../TouchableRipple/TouchableRipple'
import {useAnimated} from './useAnimated'

export interface ListItemProps extends TouchableRippleProps {
    activeKey?: string
    addonAfter?: React.JSX.Element
    addonBefore?: React.JSX.Element
    closeIcon?: boolean
    closeIconName?: IconName
    closeIconType?: IconType
    dataKey?: string
    headline?: string
    itemGap?: number
    leading?: React.JSX.Element
    onActive?: (value?: string) => void
    onClosed?: (value?: string) => void
    onVisible?: (value?: string) => void
    size?: Size
    supporting?: string | React.JSX.Element
    supportingTextNumberOfLines?: number
    trailing?: React.JSX.Element
    visible?: boolean

    /**
     * The "trailingButton" is used to indicate whether the custom trailing is a button element.
     * If set to true, it will add default button visibility interaction to the custom trailing,
     *  making it behave consistently with the default trailing button. This property only takes
     * effect when custom trailing exists.
     */
    trailingButton?: boolean
}

export interface RenderProps extends ListItemProps {
    active?: boolean
    activeColor: string
    eventName: EventName
    onAddonAfterLayout: (event: LayoutChangeEvent) => void
    onAddonBeforeLayout: (event: LayoutChangeEvent) => void
    onEvent: OnEvent
    renderStyle: {
        containerAnimatedStyle: AnimatedStyle<ViewStyle>
        mainAnimatedStyle: AnimatedStyle<ViewStyle>
        trailingAnimatedStyle: AnimatedStyle<ViewStyle>
    }
    touchableLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>
    underlayColor: string
}

interface ListItemBaseProps extends ListItemProps {
    render: (props: RenderProps) => React.JSX.Element
}

interface InitialState {
    active?: boolean
    addonAfterLayout: LayoutRectangle
    addonBeforeLayout: LayoutRectangle
    closed?: boolean
    eventName: EventName
    layout: LayoutRectangle
    state: State
    status: ComponentStatus
    touchableLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>
    trailingEventName: EventName
}

interface ProcessEventOptions {
    setState: Updater<InitialState>
}

type ProcessPressOutOptions = Pick<
    RenderProps,
    'activeKey' | 'dataKey' | 'onActive'
> &
    ProcessEventOptions

type ProcessClosedOptions = Pick<RenderProps, 'onClosed'>
type ProcessTrailingEventOptions = {callback?: () => void} & ProcessEventOptions
type ProcessStateChangeOptions = OnStateChangeOptions & ProcessPressOutOptions
interface RenderTrailingOptions
    extends Pick<
        RenderProps,
        'closeIcon' | 'trailing' | 'size' | 'closeIconName' | 'closeIconType'
    > {
    theme: DefaultTheme
    onEvent: Partial<OnEvent>
}

const processLayout = (
    event: LayoutChangeEvent,
    {setState}: ProcessEventOptions
) => {
    const nativeEventLayout = event.nativeEvent.layout

    setState(draft => {
        const updateLayout =
            draft.layout.width !== nativeEventLayout.width ||
            draft.layout.height !== nativeEventLayout.height

        updateLayout && (draft.layout = nativeEventLayout)
    })
}

const processAddonBeforeLayout = (
    event: LayoutChangeEvent,
    {setState}: ProcessEventOptions
) => {
    const nativeEventLayout = event.nativeEvent.layout

    setState(draft => {
        const updateLayout =
            draft.addonBeforeLayout.width !== nativeEventLayout.width ||
            draft.addonBeforeLayout.height !== nativeEventLayout.height

        updateLayout && (draft.addonBeforeLayout = nativeEventLayout)
    })
}

const processAddonAfterLayout = (
    event: LayoutChangeEvent,
    {setState}: ProcessEventOptions
) => {
    const nativeEventLayout = event.nativeEvent.layout

    setState(draft => {
        const updateLayout =
            draft.addonAfterLayout.width !== nativeEventLayout.width ||
            draft.addonAfterLayout.height !== nativeEventLayout.height

        updateLayout && (draft.addonAfterLayout = nativeEventLayout)
    })
}

const processPressOut = (
    event: GestureResponderEvent,
    {activeKey, dataKey, onActive, setState}: ProcessPressOutOptions
) => {
    if (activeKey === dataKey) {
        return
    }

    const {locationX = 0, locationY = 0} = event.nativeEvent

    setState(draft => {
        draft.touchableLocation = {locationX, locationY}
    })

    onActive?.(dataKey)
}

const processStateChange = (
    state: State,
    {
        event,
        eventName,
        activeKey,
        dataKey,
        onActive,
        setState
    }: ProcessStateChangeOptions
) => {
    const nextEvent = {
        layout: () => processLayout(event as LayoutChangeEvent, {setState}),
        pressOut: () =>
            processPressOut(event as GestureResponderEvent, {
                activeKey,
                dataKey,
                onActive,
                setState
            })
    } as Record<EventName, () => void>

    nextEvent[eventName]?.()

    eventName !== 'layout' &&
        setState(draft => {
            draft.eventName = eventName
            draft.state = state
        })
}

const processTrailingEvent = (
    eventName: EventName,
    {callback, setState}: ProcessTrailingEventOptions
) => {
    setState(draft => {
        draft.trailingEventName = eventName
        draft.eventName = eventName === 'hoverIn' ? 'none' : 'hoverIn'
    })

    callback?.()
}

const processClosed = ({onClosed}: ProcessClosedOptions, dataKey?: string) =>
    onClosed?.(dataKey)

const processTrailingHoverIn = ({setState}: ProcessEventOptions) =>
    processTrailingEvent('hoverIn', {setState})

const processTrailingHoverOut = ({setState}: ProcessEventOptions) =>
    processTrailingEvent('hoverOut', {setState})

const renderTrailing = ({
    closeIcon,
    onEvent,
    size,
    theme,
    trailing,
    closeIconName,
    closeIconType
}: RenderTrailingOptions) => {
    const {onHoverIn, onHoverOut, onPressOut} = onEvent
    const trailingElement =
        trailing ? cloneElement(trailing, {onHoverIn, onHoverOut}) : trailing

    const icon = (
        <Icon
            name={closeIconName}
            type={closeIconType}
        />
    )

    const renderStyle =
        size === 'small' ?
            {
                height: theme.adaptSize(theme.spacing.large),
                width: theme.adaptSize(theme.spacing.large)
            }
        :   {
                height: theme.adaptSize(theme.spacing.small * 5),
                width: theme.adaptSize(theme.spacing.small * 5)
            }

    return closeIcon ?
            <IconButton
                icon={icon}
                onHoverIn={onHoverIn}
                onHoverOut={onHoverOut}
                onPressOut={onPressOut}
                renderStyle={renderStyle}
                type='standard'
            />
        :   trailingElement
}

export const ListItemBase = forwardRef<View, ListItemBaseProps>(
    (
        {
            activeKey,
            closeIcon,
            closeIconName = 'close',
            closeIconType = 'filled',
            dataKey,
            itemGap,
            onActive,
            onClosed: onClosedSource,
            onVisible,
            render,
            size = 'medium',
            supporting,
            trailing,
            trailingButton,
            visible,
            ...renderProps
        },
        ref
    ) => {
        const [
            {
                addonAfterLayout,
                addonBeforeLayout,
                eventName,
                layout,
                state,
                touchableLocation,
                trailingEventName
            },
            setState
        ] = useImmer<InitialState>({
            addonAfterLayout: {} as LayoutRectangle,
            addonBeforeLayout: {} as LayoutRectangle,
            eventName: 'none',
            layout: {} as LayoutRectangle,
            state: 'enabled',
            status: 'idle',
            touchableLocation: {} as InitialState['touchableLocation'],
            trailingEventName: 'none'
        })

        const id = useId()
        const theme = useTheme()
        const activeColor = theme.palette.secondary.secondaryContainer
        const underlayColor = theme.palette.surface.onSurface
        const active = activeKey === dataKey
        const onClosed = useCallback(
            () => processClosed({onClosed: onClosedSource}, dataKey),
            [dataKey, onClosedSource]
        )

        const [
            {containerAnimatedStyle, trailingAnimatedStyle, mainAnimatedStyle}
        ] = useAnimated({
            active,
            addonAfterLayoutWidth: addonAfterLayout.width,
            addonBeforeLayoutWidth: addonBeforeLayout.width,
            closeIcon,
            eventName,
            itemGap,
            layoutHeight: layout.height,
            onClosed,
            state,
            trailingButton,
            trailingEventName,
            visible
        })

        const onStateChange = useCallback(
            (nextState: State, options = {} as OnStateChangeOptions) =>
                processStateChange(nextState, {
                    ...options,
                    activeKey,
                    dataKey,
                    onActive,
                    setState
                }),
            [activeKey, dataKey, onActive, setState]
        )

        const [onEvent] = useOnEvent({...renderProps, onStateChange})
        const onTrailingHoverIn = useCallback(
            () => processTrailingHoverIn({setState}),
            [setState]
        )

        const onTrailingHoverOut = useCallback(
            () => processTrailingHoverOut({setState}),
            [setState]
        )

        const onTrailingPressOut = useCallback(
            () => onVisible?.(dataKey),
            [dataKey, onVisible]
        )

        const onAddonBeforeLayout = useCallback(
            (event: LayoutChangeEvent) =>
                processAddonBeforeLayout(event, {setState}),
            [setState]
        )

        const onAddonAfterLayout = useCallback(
            (event: LayoutChangeEvent) =>
                processAddonAfterLayout(event, {setState}),
            [setState]
        )

        const trailingElement = useMemo(
            () =>
                renderTrailing({
                    closeIcon,
                    closeIconName,
                    closeIconType,
                    onEvent: {
                        onHoverIn: onTrailingHoverIn,
                        onHoverOut: onTrailingHoverOut,
                        onPressOut: onTrailingPressOut
                    },
                    size,
                    theme,
                    trailing
                }),
            [
                closeIcon,
                closeIconName,
                closeIconType,
                onTrailingHoverIn,
                onTrailingHoverOut,
                onTrailingPressOut,
                size,
                theme,
                trailing
            ]
        )

        return render({
            ...renderProps,
            active,
            activeColor,
            eventName,
            id,
            itemGap,
            onAddonAfterLayout,
            onAddonBeforeLayout,
            onEvent,
            ref,
            renderStyle: {
                containerAnimatedStyle,
                trailingAnimatedStyle,
                mainAnimatedStyle
            },
            size,
            supporting,
            touchableLocation,
            trailing: trailingElement,
            underlayColor
        })
    }
)
