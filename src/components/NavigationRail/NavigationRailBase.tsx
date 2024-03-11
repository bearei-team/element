import {FC, RefAttributes, cloneElement, useCallback, useEffect, useId, useMemo} from 'react';
import {View, ViewProps} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {ComponentStatus} from '../Common/interface';
import {FABProps} from '../FAB/FAB';
import {ListDataSource} from '../List/List';
import {
    NavigationRailItem,
    NavigationRailItemProps,
    NavigationRailType,
} from './NavigationRailItem/NavigationRailItem';

export interface NavigationDataSource extends NavigationRailItemProps {
    key?: string;
}

type BaseProps = Partial<
    Pick<NavigationRailItemProps, 'activeKey' | 'onActive' | 'type'> &
        ViewProps &
        RefAttributes<View>
>;

export interface NavigationRailProps extends BaseProps {
    data?: NavigationDataSource[];
    defaultActiveKey?: string;
    fab?: React.JSX.Element;
}

export type RenderProps = NavigationRailProps;
interface NavigationBaseProps extends NavigationRailProps {
    render: (props: RenderProps) => React.JSX.Element;
}

interface InitialState {
    activeKey?: string;
    data: ListDataSource[];
    status: ComponentStatus;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

interface RenderItemOptions {
    active?: boolean;
    activeKey?: string;
    type?: NavigationRailType;
    data: ListDataSource[];
    onActive: (value?: string) => void;
}

type ProcessActiveOptions = ProcessEventOptions & Pick<RenderProps, 'onActive'>;

const renderItems = (
    status: ComponentStatus,
    {activeKey, type, data, onActive}: RenderItemOptions,
) =>
    status === 'succeeded' &&
    data.map(({key, ...props}) => (
        <NavigationRailItem
            {...props}
            activeKey={activeKey}
            dataKey={key}
            key={key}
            onActive={onActive}
            type={type}
        />
    ));

const processFAB = (fab?: React.JSX.Element) =>
    fab ? cloneElement<FABProps>(fab, {elevated: false, size: 'medium'}) : undefined;

const processActive = ({onActive, setState}: ProcessActiveOptions, value?: string) => {
    if (typeof value !== 'string') {
        return;
    }

    setState(draft => {
        if (draft.activeKey === value) {
            return;
        }

        draft.activeKey = value;
    });

    onActive?.(value);
};

const processInit = ({setState}: ProcessEventOptions, dataSources?: ListDataSource[]) =>
    dataSources &&
    setState(draft => {
        draft.data = dataSources;
        draft.status = 'succeeded';
    });

export const NavigationRailBase: FC<NavigationBaseProps> = ({
    activeKey: activeKeySource,
    data: dataSources,
    defaultActiveKey,
    fab,
    onActive: onActiveSource,
    render,
    type,
    ...renderProps
}) => {
    const [{activeKey, data, status}, setState] = useImmer<InitialState>({
        activeKey: undefined,
        data: [],
        status: 'idle',
    });

    const id = useId();
    const onActive = useCallback(
        (value?: string) => processActive({onActive: onActiveSource, setState}, value),
        [onActiveSource, setState],
    );

    const children = useMemo(
        () =>
            renderItems(status, {
                activeKey,
                data,
                onActive,
                type,
            }),
        [activeKey, type, data, onActive, status],
    );

    useEffect(() => {
        onActive(activeKeySource ?? defaultActiveKey);
    }, [activeKeySource, defaultActiveKey, onActive]);

    useEffect(() => {
        processInit({setState}, dataSources);
    }, [dataSources, setState]);

    if (status === 'idle' || (typeof defaultActiveKey === 'string' && !activeKey)) {
        return <></>;
    }

    return render({
        ...renderProps,
        children,
        fab: processFAB(fab),
        id,
    });
};
