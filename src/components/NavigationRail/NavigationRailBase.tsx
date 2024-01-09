import {FC, cloneElement, useCallback, useEffect, useId, useMemo} from 'react';
import {useImmer} from 'use-immer';
import {ComponentStatus} from '../Common/interface';
import {ListDataSource} from '../List/List';
import {NavigationRailProps} from './NavigationRail';
import {NavigationRailItem} from './NavigationRailItem/NavigationRailItem';

export type RenderProps = NavigationRailProps;
export interface NavigationBaseProps extends NavigationRailProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface RenderItemOptions {
    active?: boolean;
    block: boolean;
    data: ListDataSource[];
    onActive: (key?: string) => void;
}

export interface Data extends ListDataSource {
    active?: boolean;
    defaultActive?: boolean;
}

const renderItems = (options: RenderItemOptions) => {
    const {onActive, block, data} = options;

    return data.map(({key, ...props}) => (
        <NavigationRailItem
            {...props}
            block={block}
            key={key}
            onPressOut={() => onActive(key)}
        />
    ));
};

const initialState = {
    data: [] as Data[],
    status: 'idle' as ComponentStatus,
};

export const NavigationRailBase: FC<NavigationBaseProps> = props => {
    const {
        block = false,
        data: dataSources = [],
        fab,
        onActive,
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

        return cloneElement(fab, {disabledElevation: true, size: 'medium'});
    };

    const handleActive = useCallback(
        (key?: string) => {
            setState(draft => {
                draft.data.forEach(datum => (datum.active = datum.key === key));
            });

            onActive?.(key);
        },
        [onActive, setState],
    );

    const children = useMemo(
        () => renderItems({data, block, onActive: handleActive}),
        [block, data, handleActive],
    );

    useEffect(() => {
        dataSources &&
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
    }, [dataSources, defaultActiveKey, setState]);

    if (status === 'idle') {
        return <></>;
    }

    return render({
        ...renderProps,
        children,
        fab: processFAB(),
        id,
    });
};
