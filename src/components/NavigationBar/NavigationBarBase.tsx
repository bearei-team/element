import {
    RefAttributes,
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useMemo
} from 'react'
import {View, ViewProps} from 'react-native'
import {Updater, useImmer} from 'use-immer'
import {ShapeProps} from '../Common/Common.styles'
import {ComponentStatus} from '../Common/interface'
import {ListDataSource} from '../List/List'
import {
    NavigationBarItem,
    NavigationBarItemProps,
    NavigationBarType
} from './NavigationBarItem/NavigationBarItem'

export interface NavigationDataSource extends NavigationBarItemProps {
    key?: string
}

type BaseProps = Partial<
    Pick<NavigationBarItemProps, 'activeKey' | 'onActive' | 'type'> &
        ViewProps &
        RefAttributes<View> &
        Pick<ShapeProps, 'shape'>
>

export interface NavigationBarProps extends BaseProps {
    block?: boolean
    data?: NavigationDataSource[]
    defaultActiveKey?: string
}

export type RenderProps = NavigationBarProps

interface NavigationBaseProps extends NavigationBarProps {
    render: (props: RenderProps) => React.JSX.Element
}

interface InitialState {
    activeKey?: string
    data: ListDataSource[]
    status: ComponentStatus
}

interface ProcessEventOptions {
    setState: Updater<InitialState>
}

interface RenderItemOptions {
    active?: boolean
    activeKey?: string
    data: ListDataSource[]
    onActive: (value?: string) => void
    type?: NavigationBarType
}

type ProcessActiveOptions = ProcessEventOptions & Pick<RenderProps, 'onActive'>

const renderItems = (
    status: ComponentStatus,
    {activeKey, type, data, onActive}: RenderItemOptions
) =>
    status === 'succeeded' &&
    data.map(({key, ...props}) => (
        <NavigationBarItem
            {...props}
            activeKey={activeKey}
            type={type}
            dataKey={key}
            key={key}
            onActive={onActive}
        />
    ))

const processActive = (
    {onActive, setState}: ProcessActiveOptions,
    value?: string
) => {
    setState(draft => {
        draft.activeKey !== value && (draft.activeKey = value)
    })

    onActive?.(value)
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

export const NavigationBarBase = forwardRef<View, NavigationBaseProps>(
    (
        {
            activeKey: activeKeySource,
            block,
            data: dataSources,
            defaultActiveKey,
            render,
            onActive: onActiveSource,
            type,
            ...renderProps
        },
        ref
    ) => {
        const [{activeKey, data, status}, setState] = useImmer<InitialState>({
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

        const children = useMemo(
            () =>
                renderItems(status, {
                    activeKey,
                    data,
                    onActive,
                    type
                }),
            [activeKey, type, data, onActive, status]
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
            children,
            id,
            block,
            ref
        })
    }
)
