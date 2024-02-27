import {FC, RefAttributes, useCallback, useEffect, useId} from 'react';
import {FlatList, FlatListProps, ListRenderItemInfo} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {ShapeProps} from '../Common/Common.styles';
import {ComponentStatus} from '../Common/interface';
import {ListItem, ListItemProps} from './ListItem/ListItem';

export interface ListDataSource
    extends Pick<
        ListItemProps,
        'headline' | 'leading' | 'supportingText' | 'supportingTextNumberOfLines' | 'trailing'
    > {
    key?: string;
}

export interface ListProps
    extends Partial<FlatListProps<ListDataSource> & RefAttributes<FlatList<ListDataSource>>> {
    activeKey?: string;

    /**
     * Sets whether the item can be closed.
     */
    close?: boolean;
    data?: ListDataSource[];
    defaultActiveKey?: string;

    /**
     * Set the shape of the item.
     */
    shape?: ShapeProps['shape'];

    /**
     * Specifies the spacing between items
     */
    gap?: number;
    onActive?: (key?: string) => void;
    onClose?: (key?: string) => void;
    supportingTextNumberOfLines?: ListDataSource['supportingTextNumberOfLines'];
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
        | 'shape'
        | 'supportingTextNumberOfLines'
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
type ProcessActiveKeyOptions = ProcessEventOptions & Pick<RenderProps, 'activeKey'>;

const processActive = ({onActive, setState}: ProcessActiveOptions, key?: string) =>
    typeof key === 'string' &&
    setState(draft => {
        if (draft.activeKey === key) {
            return;
        }

        draft.activeKey = key;
        onActive?.(key);
    });

const processClose = ({onClose, setState}: ProcessCloseOptions, key?: string) =>
    typeof key === 'string' &&
    setState(draft => {
        draft.data = draft.data.filter(datum => datum.key !== key);
        onClose?.(key);
    });

const processInit = ({setState, activeKey}: ProcessEventOptions, dataSources?: ListDataSource[]) =>
    dataSources &&
    setState(draft => {
        draft.data = dataSources;
        draft.activeKey = activeKey;
        draft.status === 'idle' && (draft.status = 'succeeded');
    });

const processActiveKey = ({activeKey, setState}: ProcessActiveKeyOptions) =>
    typeof activeKey === 'string' &&
    setState(draft => {
        if (draft.status !== 'succeeded' || draft.activeKey === activeKey) {
            return;
        }

        draft.activeKey = activeKey;
    });

const renderItem = ({
    activeKey,
    close,
    defaultActiveKey,
    gap,
    item,
    onActive,
    onClose,
    shape,
    supportingTextNumberOfLines,
}: RenderItemOptions) => (
    <ListItem
        {...item}
        {...(typeof item.supportingTextNumberOfLines !== 'number' && {
            supportingTextNumberOfLines,
        })}
        activeKey={activeKey}
        close={close}
        defaultActiveKey={defaultActiveKey}
        gap={gap}
        indexKey={item.key}
        key={item.key}
        onActive={onActive}
        onClose={onClose}
        shape={shape}
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
    shape,
    ...renderProps
}) => {
    const [{data, status, activeKey}, setState] = useImmer<InitialState>({
        activeKey: undefined,
        data: [],
        status: 'idle',
    });

    const id = useId();
    const onActive = useCallback(
        (key?: string) => processActive({onActive: renderProps.onActive, setState}, key),
        [renderProps.onActive, setState],
    );

    const onClose = useCallback(
        (key?: string) => processClose({onClose: renderProps.onClose, setState}, key),
        [renderProps.onClose, setState],
    );

    const processRenderItem = useCallback(
        (options: ListRenderItemInfo<ListDataSource>) =>
            renderItem({
                ...options,
                activeKey,
                close,

                gap,
                onActive,
                onClose,
                shape,
                supportingTextNumberOfLines,
            }),
        [activeKey, close, gap, onActive, onClose, shape, supportingTextNumberOfLines],
    );

    useEffect(() => {
        processActiveKey({activeKey: activeKeySource, setState});
    }, [activeKeySource, setState]);

    useEffect(() => {
        processInit({setState, activeKey: activeKeySource ?? defaultActiveKey}, dataSources);
    }, [activeKeySource, dataSources, defaultActiveKey, setState]);

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
