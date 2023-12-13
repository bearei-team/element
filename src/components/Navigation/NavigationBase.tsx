import {FC, cloneElement, useCallback, useEffect, useId} from 'react';
import {useImmer} from 'use-immer';
import {ListDataSource} from '../List/List';
import {Item} from './Item/Item';
import {NavigationProps} from './Navigation';

export type RenderProps = NavigationProps;
export interface NavigationBaseProps extends NavigationProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface RenderItemOptions {
    active?: boolean;
    onActive: (key: string) => void;
    data: ListDataSource[];
    block: boolean;
}

export interface Data extends ListDataSource {
    active: boolean;
}

const renderItems = (options: RenderItemOptions) => {
    const {onActive, block, data} = options;

    return data.map(({key, ...props}) => (
        <Item {...props} key={key} block={block} onPress={() => onActive(key!)} />
    ));
};

export const NavigationBase: FC<NavigationBaseProps> = props => {
    const {block = false, data: dataSources, fab, onChange, render, ...renderProps} = props;
    const [data, setData] = useImmer<Data[]>([]);
    const id = useId();
    const processFAB = () => {
        if (!fab) {
            return fab;
        }

        return cloneElement(fab, {elevation: false, size: 'medium'});
    };

    const handleActive = useCallback(
        (key: string) => {
            setData(draft => {
                draft.forEach(datum => (datum.active = datum.key === key));
            });

            onChange?.(key);
        },
        [onChange, setData],
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
        id,
        fab: processFAB(),
        children: renderItems({data, block, onActive: handleActive}),
    });
};
