import {FC, useCallback, useEffect, useId} from 'react';
import {ListRenderItemInfo} from 'react-native';
import {useImmer} from 'use-immer';
import {ComponentStatus} from '../Common/interface';
import {ListDataSource, ListProps} from './List';
import {ListItem} from './ListItem/ListItem';

export type RenderProps = ListProps;
export interface ListBaseProps extends ListProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface RenderItemOptions extends ListRenderItemInfo<ListDataSource> {
    active?: boolean;
    close?: boolean;
    onActive: (key?: string) => void;
    onClose?: (key?: string) => void;
    supportingTextNumberOfLines?: ListDataSource['supportingTextNumberOfLines'];
    activeKey?: string;
    defaultActiveKey?: string;
}

const renderItem = (options: RenderItemOptions) => {
    const {
        item,
        onActive,
        supportingTextNumberOfLines,
        close,
        onClose,
        activeKey,
        defaultActiveKey,
    } = options;

    return (
        <ListItem
            {...item}
            {...(typeof item.supportingTextNumberOfLines !== 'number' && {
                supportingTextNumberOfLines,
            })}
            defaultActiveKey={defaultActiveKey}
            activeKey={activeKey}
            close={close}
            indexKey={item.key}
            key={item.key}
            onClose={onClose}
            onActive={onActive}
        />
    );
};

const initialState = {
    data: [] as ListDataSource[],
    status: 'idle' as ComponentStatus,
    activeKey: undefined as string | undefined,
};

export const ListBase: FC<ListBaseProps> = props => {
    const {
        close,
        data: dataSources,
        defaultActiveKey,
        onActive,
        render,
        supportingTextNumberOfLines,
        ...renderProps
    } = props;

    const [{data, status, activeKey}, setState] = useImmer(initialState);
    const id = useId();

    const handleActive = useCallback(
        (key?: string) => {
            setState(draft => {
                if (draft.activeKey !== key) {
                    draft.activeKey = key;
                }
            });

            onActive?.(key);
        },
        [onActive, setState],
    );

    const handleClose = useCallback(
        (key?: string) => {
            setState(draft => {
                draft.data = draft.data.filter(datum => datum.key !== key);
            });
        },
        [setState],
    );

    const processRenderItem = useCallback(
        (options: ListRenderItemInfo<ListDataSource>) =>
            renderItem({
                ...options,
                activeKey,
                close,
                onActive: handleActive,
                onClose: handleClose,
                supportingTextNumberOfLines,
                defaultActiveKey,
            }),
        [
            activeKey,
            close,
            defaultActiveKey,
            handleActive,
            handleClose,
            supportingTextNumberOfLines,
        ],
    );

    useEffect(() => {
        if (dataSources && status === 'idle') {
            setState(draft => {
                draft.data = dataSources;
                draft.status = 'succeeded';
            });
        }
    }, [dataSources, setState, status]);

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
