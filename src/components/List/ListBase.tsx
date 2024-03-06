import {FC, RefAttributes, useCallback, useEffect, useId} from 'react';
import {FlatList, FlatListProps, ListRenderItemInfo} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {ComponentStatus} from '../Common/interface';
import {ListItem, ListItemProps} from './ListItem/ListItem';

export interface ListDataSource
    extends Pick<
        ListItemProps,
        'headline' | 'leading' | 'supportingText' | 'supportingTextNumberOfLines' | 'trailing'
    > {
    key?: string;
}

type BaseProps = Partial<
    FlatListProps<ListDataSource> &
        RefAttributes<FlatList<ListDataSource>> &
        Pick<
            ListItemProps,
            'activeKey' | 'close' | 'onActive' | 'onClose' | 'supportingTextNumberOfLines' | 'gap'
        >
>;
export interface ListProps extends BaseProps {
    data?: ListDataSource[];
    defaultActiveKey?: string;
}

export type RenderProps = ListProps;
interface ListBaseProps extends ListProps {
    render: (props: RenderProps) => React.JSX.Element;
}

type RenderItemOptions = ListRenderItemInfo<ListDataSource> &
    Pick<
        RenderProps,
        | 'activeKey'
        | 'close'
        | 'defaultActiveKey'
        | 'gap'
        | 'onActive'
        | 'onClose'
        | 'supportingTextNumberOfLines'
        | 'id'
    >;

interface InitialState {
    activeKey?: string;
    data: ListDataSource[];
    status: ComponentStatus;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessActiveOptions = ProcessEventOptions & Pick<RenderProps, 'onActive'>;
type ProcessCloseOptions = ProcessEventOptions & Pick<RenderProps, 'onClose'>;

const processActive = ({onActive, setState}: ProcessActiveOptions, value?: string) => {
    if (typeof value !== 'string') {
        return;
    }

    setState(draft => {
        if (draft.activeKey === value) {
            return;
        }

        draft.activeKey = value;
    });

    onActive?.(value);
};

const processClose = ({onClose, setState}: ProcessCloseOptions, value?: string) => {
    if (typeof value !== 'string') {
        return;
    }

    setState(draft => {
        draft.data = draft.data.filter(datum => datum.key !== value);
    });

    onClose?.(value);
};

const processInit = ({setState}: ProcessEventOptions, dataSources?: ListDataSource[]) =>
    dataSources &&
    setState(draft => {
        draft.data = dataSources;
        draft.status = 'succeeded';
    });

const renderItem = ({
    activeKey,
    close,
    gap,
    item,
    onActive,
    onClose,
    supportingTextNumberOfLines,
    id,
}: RenderItemOptions) => (
    <ListItem
        {...item}
        {...(typeof item.supportingTextNumberOfLines !== 'number' && {
            supportingTextNumberOfLines,
        })}
        activeKey={activeKey}
        close={close}
        dataKey={item.key}
        gap={gap}
        key={item.key}
        onActive={onActive}
        onClose={onClose}
    />
);

export const ListBase: FC<ListBaseProps> = ({
    activeKey: activeKeySource,
    close,
    data: dataSources,
    defaultActiveKey,
    gap,
    render,
    supportingTextNumberOfLines,
    onActive: onActiveSource,
    onClose: onCloseSource,
    ...renderProps
}) => {
    const [{data, status, activeKey}, setState] = useImmer<InitialState>({
        activeKey: undefined,
        data: [],
        status: 'idle',
    });

    const id = useId();
    const onActive = useCallback(
        (value?: string) => processActive({onActive: onActiveSource, setState}, value),
        [onActiveSource, setState],
    );

    const onClose = useCallback(
        (value?: string) => processClose({onClose: onCloseSource, setState}, value),
        [onCloseSource, setState],
    );

    const processRenderItem = useCallback(
        (options: ListRenderItemInfo<ListDataSource>) =>
            renderItem({
                ...options,
                activeKey,
                close,
                gap,
                id,
                onActive,
                onClose,
                supportingTextNumberOfLines,
            }),
        [activeKey, close, gap, id, onActive, onClose, supportingTextNumberOfLines],
    );

    useEffect(() => {
        onActive(activeKeySource ?? defaultActiveKey);
    }, [activeKeySource, defaultActiveKey, onActive]);

    useEffect(() => {
        processInit({setState}, dataSources);
    }, [dataSources, setState]);

    if (status === 'idle') {
        return <></>;
    }

    return render({
        ...renderProps,
        data,
        id,
        renderItem: processRenderItem,
    });
};
