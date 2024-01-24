import {FC, cloneElement, useEffect, useId, useMemo} from 'react';
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

export interface ProcessOptions {
    setState?: Updater<typeof initialState>;
}

export type ProcessActiveOptions = ProcessOptions & Pick<RenderProps, 'onActive'>;

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

const processActive =
    ({onActive, setState}: ProcessActiveOptions) =>
    (key?: string) => {
        setState?.(draft => {
            if (draft.activeKey !== key) {
                draft.activeKey = key;
            }
        });

        onActive?.(key);
    };

const initialState = {
    activeKey: undefined as string | undefined,
    data: [] as ListDataSource[],
    status: 'idle' as ComponentStatus,
};

export const NavigationRailBase: FC<NavigationBaseProps> = ({
    block,
    data: dataSources,
    defaultActiveKey,
    fab,
    render,
    ...renderProps
}) => {
    const [{activeKey, data, status}, setState] = useImmer(initialState);
    const id = useId();
    const onActive = useMemo(
        () => processActive({onActive: renderProps.onActive, setState}),
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
        fab: processFAB(fab),
        id,
    });
};
