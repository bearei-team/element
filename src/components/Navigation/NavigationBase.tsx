import {FC, cloneElement, useCallback, useEffect, useId} from 'react';
import {useImmer} from 'use-immer';
import {ListDataSource} from '../List/List';
import {NavigationProps} from './Navigation';
import {NavigationItem} from './NavigationItem/NavigationItem';

export type RenderProps = NavigationProps;
export interface NavigationBaseProps extends NavigationProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface RenderItemOptions {
    active?: boolean;
    block: boolean;
    data: ListDataSource[];
    onActive: (key: string) => void;
}

export interface Data extends ListDataSource {
    active: boolean;
}

const renderItems = (options: RenderItemOptions) => {
    const {onActive, block, data} = options;

    return data.map(({key, ...props}) => (
        <NavigationItem
            {...props}
            block={block}
            key={key}
            onPress={() => onActive(key!)}
        />
    ));
};

const initialState = {
    data: [] as Data[],
};

export const NavigationBase: FC<NavigationBaseProps> = props => {
    const {
        block = false,
        data: dataSources,
        fab,
        onChange,
        render,
        ...renderProps
    } = props;

    const [{data}, setData] = useImmer(initialState);
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
                draft.data.forEach(datum => (datum.active = datum.key === key));
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
        children: renderItems({data, block, onActive: handleActive}),
        fab: processFAB(),
        id,
    });
};
