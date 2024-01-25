import {FC, useCallback, useEffect, useId, useMemo} from 'react';
import {ListRenderItemInfo} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {ComponentStatus} from '../Common/interface';
import {ListDataSource, ListProps} from './List';
import {ListItem} from './ListItem/ListItem';

export type RenderProps = ListProps;
export interface ListBaseProps extends ListProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface RenderItemOptions extends ListRenderItemInfo<ListDataSource> {
    activeKey?: string;
    close?: boolean;
    defaultActiveKey?: string;
    onActive: (key?: string) => void;
    onClose?: (key?: string) => void;
    supportingTextNumberOfLines?: ListDataSource['supportingTextNumberOfLines'];
}

export interface ProcessEventOptions {
    setState: Updater<typeof initialState>;
}

export type ProcessActiveOptions = ProcessEventOptions & Pick<RenderProps, 'onActive'>;
export type ProcessCloseOptions = ProcessEventOptions & Pick<RenderProps, 'onClose'>;

const processActive =
    ({onActive, setState}: ProcessActiveOptions) =>
    (key?: string) => {
        setState(draft => {
            if (draft.activeKey !== key) {
                draft.activeKey = key;
            }
        });

        onActive?.(key);
    };

const processClose =
    ({onClose, setState}: ProcessCloseOptions) =>
    (key?: string) => {
        setState(draft => {
            draft.data = draft.data.filter(datum => datum.key !== key);
        });

        onClose?.(key);
    };

const renderItem = ({
    activeKey,
    close,
    defaultActiveKey,
    item,
    onActive,
    onClose,
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
        indexKey={item.key}
        key={item.key}
        onActive={onActive}
        onClose={onClose}
    />
);

const initialState = {
    activeKey: undefined as string | undefined,
    data: [] as ListDataSource[],
    status: 'idle' as ComponentStatus,
};

export const ListBase: FC<ListBaseProps> = ({
    close,
    data: dataSources,
    defaultActiveKey,
    render,
    supportingTextNumberOfLines,
    ...renderProps
}) => {
    const [{data, status, activeKey}, setState] = useImmer(initialState);
    const id = useId();
    const onActive = useMemo(
        () => processActive({onActive: renderProps.onActive, setState}),
        [renderProps.onActive, setState],
    );

    const onClose = useMemo(
        () => processClose({onClose: renderProps.onClose, setState}),
        [renderProps.onClose, setState],
    );

    const processRenderItem = useCallback(
        (options: ListRenderItemInfo<ListDataSource>) =>
            renderItem({
                ...options,
                activeKey,
                close,
                defaultActiveKey,
                onActive,
                onClose,
                supportingTextNumberOfLines,
            }),
        [activeKey, close, defaultActiveKey, onActive, onClose, supportingTextNumberOfLines],
    );

    useEffect(() => {
        if (dataSources) {
            setState(draft => {
                draft.data = dataSources;
                draft.status === 'idle' && (draft.status = 'succeeded');
            });
        }
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
