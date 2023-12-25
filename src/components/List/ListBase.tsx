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

export const ListBase: FC<ListBaseProps> = props => {
    const {
        render,
        data: dataSources,
        onChange,
        close,
        supportingTextNumberOfLines,
        ...renderProps
    } = props;
    const id = useId();
    const [data, setData] = useImmer<Data[]>([]);

    const handleActive = useCallback(
        (key: string) => {
            setData(draft => {
                draft.forEach(datum => (datum.active = datum.key === key));
            });

            onChange?.(key);
        },
        [onChange, setData],
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
            setData(() =>
                dataSources.map((datum, index) => ({
                    ...datum,
                    active: false,
                    key: datum.key ?? index,
                })),
            );
    }, [dataSources, setData]);

    return render({
        ...renderProps,
        data,
        renderItem: processRenderItem,
        id,
    });
};
