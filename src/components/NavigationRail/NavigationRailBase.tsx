import {FC, RefAttributes, cloneElement, useCallback, useEffect, useId, useRef} from 'react';
import {View, ViewProps} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {ComponentStatus} from '../Common/interface';
import {FABProps} from '../FAB/FAB';
import {ListDataSource} from '../List/List';

import {NavigationRailItem, NavigationRailItemProps} from './NavigationRailItem/NavigationRailItem';

interface NavigationDataSource extends NavigationRailItemProps {
    key?: string;
}

export interface NavigationRailProps extends Partial<ViewProps & RefAttributes<View>> {
    activeKey?: string;
    block?: boolean;
    data?: NavigationDataSource[];
    defaultActiveKey?: string;
    fab?: React.JSX.Element;
    onActive?: (key?: string) => void;
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
    block?: boolean;
    data: ListDataSource[];
    defaultActiveKey?: string;
    onActive: (key?: string) => void;
}

type ProcessActiveOptions = ProcessEventOptions & Pick<RenderProps, 'onActive'>;
type ProcessActiveKeyOptions = ProcessEventOptions & Pick<RenderProps, 'activeKey'>;

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
    fab ? cloneElement<FABProps>(fab, {elevated: false, size: 'medium'}) : undefined;

const processActive = ({onActive, setState}: ProcessActiveOptions, key?: string) =>
    typeof key === 'string' &&
    setState(draft => {
        if (draft.activeKey === key) {
            return;
        }

        draft.activeKey = key;
        onActive?.(key);
    });

const processInit = ({setState}: ProcessEventOptions, dataSources?: ListDataSource[]) =>
    dataSources &&
    setState(draft => {
        draft.data = dataSources;
        draft.status = 'succeeded';
    });

const processActiveKey = ({activeKey, setState}: ProcessActiveKeyOptions) =>
    typeof activeKey === 'string' &&
    setState(draft => {
        if (draft.status !== 'succeeded' || draft.activeKey === activeKey) {
            return;
        }

        draft.activeKey = activeKey;
    });

export const NavigationRailBase: FC<NavigationBaseProps> = ({
    activeKey: activeKeySource,
    block,
    data: dataSources,
    defaultActiveKey,
    fab,
    render,
    ...renderProps
}) => {
    const isFirstRender = useRef(true);
    const [{activeKey, data, status}, setState] = useImmer<InitialState>({
        activeKey: undefined,
        data: [],
        status: 'idle',
    });

    const id = useId();
    const onActive = useCallback(
        (key?: string) => processActive({onActive: renderProps.onActive, setState}, key),
        [renderProps.onActive, setState],
    );

    const children = useCallback(() => {
        return renderItems({
            activeKey,
            block,
            data,
            defaultActiveKey,
            onActive,
        });
    }, [activeKey, block, data, defaultActiveKey, onActive]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        processActiveKey({activeKey: activeKeySource, setState});
    }, [activeKeySource, setState]);

    useEffect(() => {
        processInit({setState}, dataSources);
    }, [dataSources, setState]);

    if (status === 'idle') {
        return <></>;
    }

    return render({
        ...renderProps,
        children: children(),
        fab: processFAB(fab),
        id,
        // onLayout: () => {
        //     setState(d => {
        //         d.status = 'succeeded';
        //     });
        // },
    });
};
