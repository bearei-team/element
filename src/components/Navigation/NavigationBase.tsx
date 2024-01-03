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
    status: 'idle' as 'idle' | 'loading' | 'failed' | 'succeeded',
};

export const NavigationBase: FC<NavigationBaseProps> = props => {
    const {
        activeKey,
        block = false,
        data: dataSources = [],
        fab,
        onChange,
        render,
        defaultActiveKey,
        ...renderProps
    } = props;

    const [{data, status}, setState] = useImmer(initialState);
    const id = useId();
    const processFAB = () => {
        if (!fab) {
            return fab;
        }

        return cloneElement(fab, {elevation: false, size: 'medium'});
    };

    const handleActive = useCallback(
        (key: string) => {
            setState(draft => {
                draft.data.forEach(datum => (datum.active = datum.key === key));
            });

            onChange?.(key);
        },
        [onChange, setState],
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
        children: renderItems({data, block, onActive: handleActive}),
        fab: processFAB(),
        id,
    });
};
