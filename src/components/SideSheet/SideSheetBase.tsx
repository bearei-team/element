import {forwardRef, useCallback, useEffect, useId, useMemo} from 'react'
import {View} from 'react-native'
import {Updater, useImmer} from 'use-immer'
import {emitter} from '../../context/ModalProvider'
import {SheetProps} from './Sheet/Sheet'

export interface SideSheetProps extends SheetProps {
    defaultVisible?: boolean
}

export interface RenderProps extends SideSheetProps {
    closed?: boolean
}

interface SideSheetBaseProps extends SideSheetProps {
    render: (props: RenderProps) => React.JSX.Element
}

interface InitialState {
    closed?: boolean
    visible?: boolean
}

interface ProcessEventOptions {
    setState: Updater<InitialState>
}

type ProcessEmitOptions = Pick<RenderProps, 'visible' | 'id' | 'type'>
type ProcessClosedOptions = Pick<RenderProps, 'onClose'>

const processClose = ({setState}: ProcessEventOptions) =>
    setState(draft => {
        draft.visible !== false && (draft.visible = false)
    })

const processClosed = ({onClose}: ProcessClosedOptions) => onClose?.()
const processVisible = ({setState}: ProcessEventOptions, visible?: boolean) =>
    typeof visible === 'boolean' &&
    setState(draft => {
        draft.visible !== visible && (draft.visible = visible)
    })

const processEmit = (
    sheet: React.JSX.Element,
    {visible, id, type}: ProcessEmitOptions
) =>
    typeof visible === 'boolean' &&
    type === 'modal' &&
    emitter.emit('modal', {id: `sideSheet__${id}`, element: sheet})

const processUnmount = (id: string, {type}: Pick<RenderProps, 'type'>) =>
    type === 'modal' &&
    emitter.emit('modal', {id: `sideSheet__${id}`, element: undefined})

export const SideSheetBase = forwardRef<View, SideSheetBaseProps>(
    (
        {
            defaultVisible,
            onClose: onCloseSource,
            render,
            type = 'modal',
            visible: visibleSource,
            ...renderProps
        },
        ref
    ) => {
        const [{visible}, setState] = useImmer<InitialState>({
            visible: undefined
        })

        const id = useId()
        const onVisible = useCallback(
            (value?: boolean) => processVisible({setState}, value),
            [setState]
        )

        const onClose = useCallback(() => processClose({setState}), [setState])
        const onClosed = useCallback(
            () => processClosed({onClose: onCloseSource}),
            [onCloseSource]
        )

        const sheet = useMemo(
            () =>
                render({...renderProps, visible, onClose, type, ref, onClosed}),
            [onClose, onClosed, ref, render, renderProps, type, visible]
        )

        useEffect(() => {
            onVisible(visibleSource ?? defaultVisible)
        }, [defaultVisible, onVisible, visibleSource])

        useEffect(() => {
            processEmit(sheet, {id, visible, type})
        }, [id, sheet, type, visible])

        useEffect(
            () => () => {
                processUnmount(id, {type})
            },
            [id, type]
        )

        return type === 'standard' ? sheet : <></>
    }
)
