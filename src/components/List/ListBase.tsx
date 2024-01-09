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
}

export interface Data extends ListDataSource {
    active?: boolean;
    defaultActive?: boolean;
}

const renderItem = (options: RenderItemOptions) => {
    const {item, onActive, supportingTextNumberOfLines, close, onClose} =
        options;

    return (
        <ListItem
            {...item}
            {...(typeof item.supportingTextNumberOfLines !== 'number' && {
                supportingTextNumberOfLines,
            })}
            close={close}
            indexKey={item.key}
            key={item.key}
            onClose={onClose}
            onPressOut={() => onActive(item.key)}
        />
    );
};

const initialState = {
    data: [] as Data[],
    status: 'idle' as ComponentStatus,
};

export const ListBase: FC<ListBaseProps> = props => {
    const {
        close,
        data: dataSources = [],
        defaultActiveKey,
        onActive,
        render,
        supportingTextNumberOfLines,
        ...renderProps
    } = props;

    const [{data, status}, setState] = useImmer(initialState);
    const id = useId();

    const handleActive = useCallback(
        (key?: string) => {
            setState(draft => {
                draft.data.forEach(datum => (datum.active = datum.key === key));
            });

            onActive?.(key);
        },
        [onActive, setState],
    );

    const handleClose = useCallback(
        (key?: string) => {
            setState(draft => {
                console.info(draft.data.filter(datum => datum.key !== key));
                draft.data = draft.data.filter(datum => datum.key !== key);
            });
        },
        [setState],
    );

    const processRenderItem = useCallback(
        (options: ListRenderItemInfo<ListDataSource>) =>
            renderItem({
                ...options,
                close,
                onActive: handleActive,
                onClose: handleClose,
                supportingTextNumberOfLines,
            }),
        [close, handleActive, handleClose, supportingTextNumberOfLines],
    );

    useEffect(() => {
        if (status === 'idle') {
            setState(draft => {
                draft.data = dataSources.map((datum, index) => ({
                    ...datum,
                    defaultActive: defaultActiveKey
                        ? datum.key === defaultActiveKey
                        : false,
                    key: `${datum.key ?? index}`,
                }));

                draft.status = 'succeeded';
            });
        }
    }, [dataSources, defaultActiveKey, setState, status]);

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
