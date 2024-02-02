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
export type ProcessActiveKeyOptions = ProcessEventOptions & Pick<RenderProps, 'activeKey'>;

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

const processFAB = (fab?: React.JSX.Element) =>
    fab ? cloneElement(fab, {elevated: false, size: 'medium'}) : undefined;

const processActive = ({onActive, setState}: ProcessActiveOptions, key?: string) => {
    if (typeof key === 'undefined') {
        return;
    }

    setState(draft => {
        draft.activeKey !== key && (draft.activeKey = key);
    });

    onActive?.(key);
};

const processInit = ({setState}: ProcessEventOptions, dataSources?: ListDataSource[]) =>
    dataSources &&
    setState(draft => {
        draft.data = dataSources;
        draft.status === 'idle' && (draft.status = 'succeeded');
    });

const processActiveKey = (
    status: ComponentStatus,
    {activeKey, setState}: ProcessActiveKeyOptions,
) =>
    status === 'succeeded' &&
    setState(draft => {
        draft.activeKey = activeKey;
    });

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
        processInit({setState}, dataSources);
    }, [dataSources, setState]);

    useEffect(() => {
        processActiveKey(status, {activeKey: activeKeySource, setState});
    }, [activeKeySource, setState, status]);

    if (status === 'idle') {
        return <></>;
    }

    return render({
        ...renderProps,
        children,
        fab: processFAB(fab),
        id,
    });
};
