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
    activeKey?: string;
    block: boolean;
    data: ListDataSource[];
    defaultActiveKey?: string;
    onActive: (key?: string) => void;
}

const renderItems = (options: RenderItemOptions) => {
    const {onActive, block, data, activeKey, defaultActiveKey} = options;

    return data.map(({key, ...props}) => (
        <NavigationRailItem
            {...props}
            defaultActiveKey={defaultActiveKey}
            activeKey={activeKey}
            block={block}
            indexKey={key}
            key={key}
            onActive={onActive}
        />
    ));
};

const initialState = {
    data: [] as ListDataSource[],
    status: 'idle' as ComponentStatus,
    activeKey: undefined as string | undefined,
};

export const NavigationRailBase: FC<NavigationBaseProps> = props => {
    const {
        block = false,
        data: dataSources,
        defaultActiveKey,
        fab,
        onActive,
        render,
        ...renderProps
    } = props;

    const [{data, status, activeKey}, setState] = useImmer(initialState);
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
                if (draft.activeKey !== key) {
                    draft.activeKey = key;
                }
            });

            onActive?.(key);
        },
        [onActive, setState],
    );

    const children = useMemo(
        () =>
            renderItems({
                activeKey,
                block,
                data,
                defaultActiveKey,
                onActive: handleActive,
            }),
        [activeKey, block, data, defaultActiveKey, handleActive],
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
        children,
        fab: processFAB(),
        id,
    });
};
