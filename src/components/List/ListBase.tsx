import {FC, useCallback, useEffect, useId} from 'react';
import {ListRenderItemInfo} from 'react-native';
import {useImmer} from 'use-immer';
import {ListDataSource, ListProps} from './List';
import {ListItem} from './ListItem/ListItem';

export type RenderProps = ListProps;
export interface ListBaseProps extends ListProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface RenderItemOptions extends ListRenderItemInfo<ListDataSource> {
    active?: boolean;
    close?: boolean;
    onActive: (key: string) => void;
    supportingTextNumberOfLines?: ListDataSource['supportingTextNumberOfLines'];
}

export interface Data extends ListDataSource {
    active: boolean;
}

const renderItem = (options: RenderItemOptions) => {
    const {item, onActive, supportingTextNumberOfLines, close} = options;

    return (
        <ListItem
            {...item}
            {...(typeof item.supportingTextNumberOfLines !== 'number' && {
                supportingTextNumberOfLines,
            })}
            close={close}
            key={item.key}
            onPress={() => onActive(item.key!)}
        />
    );
};

const initialState = {
    data: [] as Data[],
    status: 'idle' as 'idle' | 'loading' | 'failed' | 'succeeded',
};

export const ListBase: FC<ListBaseProps> = props => {
    const {
        activeKey,
        close,
        data: dataSources = [],
        defaultActiveKey,
        onChange,
        render,
        supportingTextNumberOfLines,
        ...renderProps
    } = props;

    const [{data, status}, setState] = useImmer(initialState);
    const id = useId();

    const handleActive = useCallback(
        (key: string) => {
            setState(draft => {
                draft.data.forEach(datum => (datum.active = datum.key === key));
            });

            onChange?.(key);
        },
        [onChange, setState],
    );

    const processRenderItem = useCallback(
        (options: ListRenderItemInfo<ListDataSource>) =>
            renderItem({
                ...options,
                close,
                onActive: handleActive,
                supportingTextNumberOfLines,
            }),
        [close, handleActive, supportingTextNumberOfLines],
    );

    useEffect(() => {
        dataSources &&
            setState(draft => {
                draft.data = dataSources.map((datum, index) => ({
                    ...datum,
                    active: defaultActiveKey
                        ? datum.key === defaultActiveKey
                        : false,
                    key: `${datum.key ?? index}`,
                }));

                draft.status = 'succeeded';
            });
    }, [dataSources, defaultActiveKey, setState]);

    useEffect(() => {
        status === 'succeeded' &&
            activeKey &&
            setState(draft => {
                if (draft.data.length === 0) {
                    draft.data = dataSources.map((datum, index) => ({
                        ...datum,
                        active: datum.key === activeKey,
                        key: `${datum.key ?? index}`,
                    }));

                    return;
                }

                draft.data.forEach(datum => {
                    datum.active = datum.key === activeKey;
                });
            });
    }, [activeKey, dataSources, setState, status]);

    return render({
        ...renderProps,
        data,
        id,
        renderItem: processRenderItem,
    });
};
