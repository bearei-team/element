import {FC, cloneElement, useCallback, useEffect, useId, useMemo} from 'react';
import {Updater, useImmer} from 'use-immer';
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
    block?: boolean;
    data: ListDataSource[];
    defaultActiveKey?: string;
    onActive: (key?: string) => void;
}

export interface ProcessEventOptions {
    setState: Updater<typeof initialState>;
}

export type ProcessActiveOptions = ProcessEventOptions & Pick<RenderProps, 'onActive'>;

const renderItems = ({activeKey, block, data, defaultActiveKey, onActive}: RenderItemOptions) =>
    data.map(({key, ...props}) => (
        <NavigationRailItem
            {...props}
            activeKey={activeKey}
            block={block}
            defaultActiveKey={defaultActiveKey}
            indexKey={key}
            key={key}
            onActive={onActive}
        />
    ));

const processFAB = (fab?: React.JSX.Element | undefined) => {
    if (!fab) {
        return fab;
    }

    return cloneElement(fab, {disabledElevation: true, size: 'medium'});
};

const processActive = ({onActive, setState}: ProcessActiveOptions, key?: string) => {
    if (typeof key !== 'undefined') {
        setState(draft => {
            if (draft.activeKey !== key) {
                draft.activeKey = key;
            }
        });

        onActive?.(key);
    }
};

const initialState = {
    activeKey: undefined as string | undefined,
    data: [] as ListDataSource[],
    status: 'idle' as ComponentStatus,
};

export const NavigationRailBase: FC<NavigationBaseProps> = ({
    activeKey: activeKeySource,
    block,
    data: dataSources,
    defaultActiveKey,
    fab,
    render,
    ...renderProps
}) => {
    const [{activeKey, data, status}, setState] = useImmer(initialState);
    const id = useId();
    const onActive = useCallback(
        (key?: string) => processActive({onActive: renderProps.onActive, setState}, key),
        [renderProps.onActive, setState],
    );

    const fabElement = useMemo(() => processFAB(fab), [fab]);
    const children = useMemo(
        () =>
            renderItems({
                activeKey,
                block,
                data,
                defaultActiveKey,
                onActive,
            }),
        [activeKey, block, data, defaultActiveKey, onActive],
    );

    useEffect(() => {
        if (dataSources) {
            setState(draft => {
                draft.data = dataSources;
                draft.status === 'idle' && (draft.status = 'succeeded');
            });
        }
    }, [dataSources, setState]);

    useEffect(() => {
        if (status === 'succeeded') {
            setState(draft => {
                draft.activeKey = activeKeySource;
            });
        }
    }, [activeKeySource, setState, status]);

    if (status === 'idle') {
        return <></>;
    }

    return render({
        ...renderProps,
        children,
        fab: fabElement,
        id,
    });
};
