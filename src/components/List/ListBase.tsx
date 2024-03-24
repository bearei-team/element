import {RefAttributes, forwardRef, useCallback, useEffect, useId} from 'react'
import {FlatList, FlatListProps, ListRenderItemInfo} from 'react-native'
import {Updater, useImmer} from 'use-immer'
import {ComponentStatus} from '../Common/interface'
import {ListItem, ListItemProps} from './ListItem/ListItem'

export interface ListDataSource
    extends Pick<
        ListItemProps,
        | 'addonAfter'
        | 'addonBefore'
        | 'headline'
        | 'leading'
        | 'supporting'
        | 'supportingTextNumberOfLines'
        | 'trailing'
        | 'visible'
    > {
    key?: string
}

type BaseProps = Partial<
    FlatListProps<ListDataSource> &
        RefAttributes<FlatList<ListDataSource>> &
        Pick<
            ListItemProps,
            | 'activeKey'
            | 'closeIcon'
            | 'closeIconName'
            | 'closeIconType'
            | 'itemGap'
            | 'onActive'
            | 'onClosed'
            | 'onVisible'
            | 'shape'
            | 'size'
            | 'supportingTextNumberOfLines'
        >
>
export interface ListProps extends BaseProps {
    data?: ListDataSource[]
    defaultActiveKey?: string
}

export type RenderProps = ListProps
interface ListBaseProps extends ListProps {
    render: (props: RenderProps) => React.JSX.Element
}

type RenderItemOptions = ListRenderItemInfo<ListDataSource> &
    Pick<
        RenderProps,
        | 'activeKey'
        | 'closeIcon'
        | 'closeIconName'
        | 'closeIconType'
        | 'defaultActiveKey'
        | 'itemGap'
        | 'onActive'
        | 'onClosed'
        | 'onVisible'
        | 'shape'
        | 'size'
        | 'supportingTextNumberOfLines'
    >

interface InitialState {
    activeKey?: string
    data: ListDataSource[]
    status: ComponentStatus
}

interface ProcessEventOptions {
    setState: Updater<InitialState>
}

type ProcessActiveOptions = ProcessEventOptions & Pick<RenderProps, 'onActive'>

const processActive = (
    {onActive, setState}: ProcessActiveOptions,
    value?: string
) => {
    setState(draft => {
        draft.activeKey !== value && (draft.activeKey = value)
    })

    onActive?.(value)
}

const processVisible = ({setState}: ProcessEventOptions, value?: string) => {
    if (typeof value !== 'string') {
        return
    }

    setState(draft => {
        draft.data = draft.data.map(datum =>
            datum.key === value ? {...datum, visible: false} : datum
        )
    })
}

const processInit = (
    {setState}: ProcessEventOptions,
    dataSources?: ListDataSource[]
) =>
    dataSources &&
    setState(draft => {
        draft.data = dataSources
        draft.status = 'succeeded'
    })

const renderItem = ({
    item,
    supportingTextNumberOfLines,
    ...props
}: RenderItemOptions) => (
    <ListItem
        {...item}
        {...(typeof item.supportingTextNumberOfLines !== 'number' && {
            supportingTextNumberOfLines
        })}
        {...props}
        dataKey={item.key}
    />
)

export const ListBase = forwardRef<FlatList<ListDataSource>, ListBaseProps>(
    (
        {
            activeKey: activeKeySource,
            closeIcon,
            closeIconName,
            closeIconType,
            data: dataSources,
            defaultActiveKey,
            itemGap,
            onActive: onActiveSource,
            onClosed,
            render,
            shape,
            size,
            supportingTextNumberOfLines,
            ...renderProps
        },
        ref
    ) => {
        const [{data, status, activeKey}, setState] = useImmer<InitialState>({
            activeKey: undefined,
            data: [],
            status: 'idle'
        })

        const id = useId()
        const onActive = useCallback(
            (value?: string) =>
                processActive({onActive: onActiveSource, setState}, value),
            [onActiveSource, setState]
        )

        const onVisible = useCallback(
            (value?: string) => processVisible({setState}, value),
            [setState]
        )

        const processRenderItem = useCallback(
            (options: ListRenderItemInfo<ListDataSource>) =>
                renderItem({
                    ...options,
                    activeKey,
                    closeIcon,
                    closeIconName,
                    closeIconType,
                    itemGap,
                    onActive,
                    onClosed,
                    onVisible,
                    shape,
                    size,
                    supportingTextNumberOfLines
                }),
            [
                activeKey,
                closeIcon,
                closeIconName,
                closeIconType,
                itemGap,
                onActive,
                onClosed,
                onVisible,
                shape,
                size,
                supportingTextNumberOfLines
            ]
        )

        useEffect(() => {
            onActive(activeKeySource ?? defaultActiveKey)
        }, [activeKeySource, defaultActiveKey, onActive])

        useEffect(() => {
            processInit({setState}, dataSources)
        }, [dataSources, setState])

        if (
            status === 'idle' ||
            (typeof defaultActiveKey === 'string' && !activeKey)
        ) {
            return <></>
        }

        return render({
            ...renderProps,
            data,
            id,
            ref,
            renderItem: processRenderItem
        })
    }
)
