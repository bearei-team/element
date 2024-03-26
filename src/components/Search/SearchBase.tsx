import {
    RefAttributes,
    RefObject,
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useImperativeHandle,
    useMemo,
    useRef
} from 'react'
import {
    LayoutRectangle,
    PressableProps,
    TextInput,
    TextInputProps,
    View,
    ViewStyle
} from 'react-native'
import Animated, {AnimatedStyle} from 'react-native-reanimated'
import {useTheme} from 'styled-components/native'
import {Updater, useImmer} from 'use-immer'
import {emitter} from '../../context/ModalProvider'
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent'
import {ComponentStatus, EventName, State} from '../Common/interface'
import {List, ListDataSource, ListProps} from '../List/List'
import {Input, SearchList, TextField} from './Search.styles'
import {useAnimated} from './useAnimated'

type BaseProps = Partial<
    TextInputProps &
        Pick<
            ListProps,
            'activeKey' | 'onActive' | 'data' | 'defaultActiveKey'
        > &
        PressableProps &
        RefAttributes<TextInput>
>

export interface SearchProps extends BaseProps {
    disabled?: boolean
    leading?: React.JSX.Element
    trailing?: React.JSX.Element

    /**
     * The modal type has a problem with mouseover events being passed through
     * to lower level elements in macOS. This problem is caused by the fact that
     * react-native-macos does not implement the native modal and some of the
     * mechanisms of the macos component itself.
     */
    type?: 'standard' | 'modal'
}

export interface RenderProps extends SearchProps {
    containerRef: RefObject<View>
    eventName: EventName
    iconRenderStyle: {width: number; height: number}
    input: React.JSX.Element
    layout: LayoutRectangle
    listVisible?: boolean
    onEvent: Omit<OnEvent, 'onBlur' | 'onFocus'>
    searchList?: React.JSX.Element
    underlayColor: string
}

interface SearchBaseProps extends SearchProps {
    render: (props: RenderProps) => React.JSX.Element
}

interface InitialState {
    data?: ListDataSource[]
    eventName: EventName
    layout: LayoutRectangle & {pageX?: number; pageY?: number}
    listVisible?: boolean
    state: State
    status: ComponentStatus
    value?: string
}

interface ProcessEventOptions {
    setState: Updater<InitialState>
}

type ProcessChangeTextOptions = Pick<RenderProps, 'data' | 'onChangeText'> &
    ProcessEventOptions

type ProcessEmitOptions = Pick<InitialState, 'status'> &
    Pick<RenderProps, 'id' | 'type'> &
    Pick<RenderProps, 'listVisible'>

type ProcessStateChangeOptions = {
    ref?: RefObject<TextInput>
} & ProcessEventOptions &
    OnStateChangeOptions

type ProcessContainerLayoutOptions = ProcessEventOptions &
    Pick<RenderProps, 'listVisible'> &
    Pick<RenderProps, 'type'>

type RenderTextInputOptions = SearchProps
type RenderSearchListOptions = SearchProps & {
    containerHeight?: number
    containerPageX?: number
    containerPageY?: number
    renderStyle: {
        width?: number
        listAnimatedStyle: AnimatedStyle<ViewStyle>
    }
    visible?: boolean
}

const processFocus = (ref?: RefObject<TextInput>) => ref?.current?.focus()
const processStateChange = (
    state: State,
    {eventName, ref, setState}: ProcessStateChangeOptions
) => {
    if (eventName === 'layout') {
        return
    }

    const nextEvent = {
        pressOut: () => processFocus(ref)
    } as Record<EventName, () => void>

    nextEvent[eventName]?.()

    setState(draft => {
        if (draft.state === 'focused' && eventName !== 'blur') {
            return
        }

        draft.eventName = eventName
        draft.state = state
    })
}

const processChangeText = (
    {setState, data = [], onChangeText}: ProcessChangeTextOptions,
    text?: string
) => {
    const matchedData =
        text ?
            data.filter(({headline, supporting}) => {
                const matchText = text.toLowerCase()
                const headlineMatch = !!headline
                    ?.toLowerCase()
                    .includes(matchText)

                const supportingTextMatch =
                    typeof supporting === 'string' &&
                    !!supporting?.toLowerCase().includes(matchText)

                return headlineMatch || supportingTextMatch
            })
        :   []

    setState(draft => {
        if (draft.value === text) {
            return
        }

        typeof draft.data === 'undefined' && (draft.data = matchedData)
        draft.listVisible !== !!matchedData.length &&
            (draft.listVisible = !!matchedData.length)

        draft.value = typeof text === 'undefined' ? '' : text
    })

    typeof text === 'string' && onChangeText?.(text)
}

const processListClosed = (
    {setState}: ProcessEventOptions,
    visible?: boolean
) =>
    typeof visible === 'boolean' &&
    setState(draft => {
        draft.data !== undefined && (draft.data = undefined)
    })

const processContainerLayout = (
    {setState, type}: ProcessContainerLayoutOptions,
    containerCurrent?: View | null
) =>
    type === 'modal' &&
    containerCurrent?.measure((x, y, width, height, pageX, pageY) =>
        setState(draft => {
            const updateLayout =
                draft.layout.height !== height ||
                draft.layout.pageX !== pageX ||
                draft.layout.pageY !== pageY ||
                draft.layout.width !== width

            if (updateLayout) {
                draft.layout = {
                    height,
                    pageX,
                    pageY,
                    width,
                    x,
                    y
                }

                draft.status === 'idle' && (draft.status = 'succeeded')
            }
        })
    )

const processEmit = (
    element: React.JSX.Element,
    {id, status, listVisible, type}: ProcessEmitOptions
) =>
    status === 'succeeded' &&
    typeof listVisible === 'boolean' &&
    type === 'modal' &&
    emitter.emit('modal', {id: `search__list--${id}`, element})

const processUnmount = (id: string, {type}: Pick<RenderProps, 'type'>) =>
    type === 'modal' &&
    emitter.emit('modal', {id: `search__list--${id}`, element: undefined})

const renderTextInput = ({id, ...props}: RenderTextInputOptions) => (
    <TextField testID={`search__control--${id}`}>
        <Input
            {...props}
            /**
             * enableFocusRing is used to disable the focus style in macOS,
             * this parameter has been implemented and is available.
             * However, react-native-macos does not have an official typescript declaration for this parameter,
             * so using it directly in a typescript will result in an undefined parameter.
             */
            // @ts-ignore
            enableFocusRing={false}
            testID={`search__input--${id}`}
        />
    </TextField>
)

const AnimatedSearchList = Animated.createAnimatedComponent(SearchList)
const renderSearchList = ({
    activeKey,
    containerHeight,
    containerPageX,
    containerPageY,
    data,
    defaultActiveKey,
    id,
    onActive,
    renderStyle,
    type
}: RenderSearchListOptions) => {
    const {listAnimatedStyle, width} = renderStyle

    return (
        <AnimatedSearchList
            containerHeight={containerHeight}
            containerPageX={containerPageX}
            containerPageY={containerPageY}
            renderStyle={{width}}
            shape='extraLargeBottom'
            style={[listAnimatedStyle]}
            testID={`search__list--${id}`}
            type={type}
            visible={!!data?.length}
        >
            <List
                activeKey={activeKey}
                data={data}
                defaultActiveKey={defaultActiveKey}
                onActive={onActive}
            />
        </AnimatedSearchList>
    )
}

export const SearchBase = forwardRef<TextInput, SearchBaseProps>(
    (
        {
            activeKey,
            data: dataSources,
            defaultActiveKey,
            defaultValue,
            leading,
            onActive,
            onChangeText: onChangeTextSource,
            placeholder,
            render,
            trailing,
            type = 'modal',
            value: valueSource,
            ...textInputProps
        },
        ref
    ) => {
        const [
            {value, status, data, eventName, layout, listVisible},
            setState
        ] = useImmer<InitialState>({
            data: undefined,
            eventName: 'none',
            layout: {} as InitialState['layout'],
            listVisible: undefined,
            state: 'enabled',
            status: 'idle',
            value: ''
        })

        const containerRef = useRef<View>(null)
        const id = useId()
        const inputRef = useRef<TextInput>(null)
        const theme = useTheme()
        const placeholderTextColor = theme.palette.surface.onSurfaceVariant
        const underlayColor = theme.palette.surface.onSurface
        const onStateChange = useCallback(
            (nextState: State, options = {} as OnStateChangeOptions) =>
                processStateChange(nextState, {
                    ...options,
                    ref: inputRef,
                    setState
                }),
            [setState]
        )

        const onListClosed = useCallback(
            (visible?: boolean) => processListClosed({setState}, visible),
            [setState]
        )

        const [listAnimatedStyle] = useAnimated({
            listVisible,
            onListClosed
        })

        const [{onBlur, onFocus, ...onEvent}] = useOnEvent({
            ...textInputProps,
            onStateChange
        })
        const onChangeText = useCallback(
            (text?: string) =>
                processChangeText(
                    {
                        data: dataSources,
                        onChangeText: onChangeTextSource,
                        setState
                    },
                    text
                ),
            [dataSources, onChangeTextSource, setState]
        )

        const input = useMemo(
            () =>
                renderTextInput({
                    ...textInputProps,
                    id,
                    onBlur,
                    onChangeText,
                    onFocus,
                    placeholder,
                    placeholderTextColor,
                    ref: inputRef,
                    value
                }),
            [
                id,
                onBlur,
                onChangeText,
                onFocus,
                placeholder,
                placeholderTextColor,
                textInputProps,
                value
            ]
        )

        const searchList = useMemo(
            () =>
                renderSearchList({
                    activeKey,
                    containerHeight: layout.height,
                    containerPageX: layout.pageX,
                    containerPageY: layout.pageY,
                    data,
                    defaultActiveKey,
                    id,
                    onActive,
                    renderStyle: {listAnimatedStyle, width: layout.width},
                    type
                }),
            [
                activeKey,
                data,
                defaultActiveKey,
                id,
                listAnimatedStyle,
                layout.height,
                layout.pageX,
                layout.pageY,
                layout.width,
                onActive,
                type
            ]
        )

        useImperativeHandle(
            ref,
            () => (inputRef?.current ? inputRef?.current : {}) as TextInput,
            []
        )

        useEffect(() => {
            onChangeText(valueSource ?? defaultValue)
        }, [valueSource, defaultValue, onChangeText])

        useEffect(() => {
            processContainerLayout({setState, type}, containerRef.current)
            processEmit(searchList, {status, id, listVisible, type})
        }, [id, listVisible, searchList, setState, status, type])

        useEffect(
            () => () => {
                processUnmount(id, {type})
            },
            [id, type]
        )

        return render({
            containerRef,
            eventName,
            iconRenderStyle: {
                height: theme.adaptSize(theme.spacing.large),
                width: theme.adaptSize(theme.spacing.large)
            },
            id,
            input,
            layout,
            leading,
            listVisible: !!data?.length,
            onActive,
            onEvent: {...onEvent},
            placeholder,
            searchList,
            trailing,
            type,
            underlayColor
        })
    }
)
