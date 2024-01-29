import {FC, useCallback, useEffect, useId, useMemo} from 'react';
import {ListRenderItemInfo} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {ComponentStatus} from '../Common/interface';
import {ListDataSource, ListProps} from './List';
import {ListItem} from './ListItem/ListItem';

export type RenderProps = ListProps;
export interface ListBaseProps extends ListProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export type RenderItemOptions = ListRenderItemInfo<ListDataSource> &
    Pick<
        RenderProps,
        | 'activeKey'
        | 'close'
        | 'defaultActiveKey'
        | 'gap'
        | 'onActive'
        | 'onClose'
        | 'shape'
        | 'supportingTextNumberOfLines'
    >;

export interface ProcessEventOptions {
    setState: Updater<typeof initialState>;
}

export type ProcessActiveOptions = ProcessEventOptions & Pick<RenderProps, 'onActive'>;
export type ProcessCloseOptions = ProcessEventOptions & Pick<RenderProps, 'onClose'>;

const processActive =
    ({onActive, setState}: ProcessActiveOptions) =>
    (key?: string) => {
        setState(draft => {
            if (draft.activeKey !== key) {
                draft.activeKey = key;
            }
        });

        onActive?.(key);
    };

const processClose =
    ({onClose, setState}: ProcessCloseOptions) =>
    (key?: string) => {
        setState(draft => {
            draft.data = draft.data.filter(datum => datum.key !== key);
        });

        onClose?.(key);
    };

const renderItem = ({
    activeKey,
    close,
    defaultActiveKey,
    gap,
    item,
    onActive,
    onClose,
    shape,
    supportingTextNumberOfLines,
}: RenderItemOptions) => (
    <ListItem
        {...item}
        {...(typeof item.supportingTextNumberOfLines !== 'number' && {
            supportingTextNumberOfLines,
        })}
        activeKey={activeKey}
        close={close}
        defaultActiveKey={defaultActiveKey}
        gap={gap}
        indexKey={item.key}
        key={item.key}
        onActive={onActive}
        onClose={onClose}
        shape={shape}
    />
);

const initialState = {
    activeKey: undefined as string | undefined,
    data: [] as ListDataSource[],
    status: 'idle' as ComponentStatus,
};

export const ListBase: FC<ListBaseProps> = ({
    activeKey: activeKeySource,
    close,
    data: dataSources,
    defaultActiveKey,
    gap,
    render,
    supportingTextNumberOfLines,
    shape,
    ...renderProps
}) => {
    const [{data, status, activeKey}, setState] = useImmer(initialState);
    const id = useId();
    const onActive = useMemo(
        () => processActive({onActive: renderProps.onActive, setState}),
        [renderProps.onActive, setState],
    );

    const onClose = useMemo(
        () => processClose({onClose: renderProps.onClose, setState}),
        [renderProps.onClose, setState],
    );

    const processRenderItem = useCallback(
        (options: ListRenderItemInfo<ListDataSource>) =>
            renderItem({
                ...options,
                activeKey,
                close,
                defaultActiveKey,
                gap,
                onActive,
                onClose,
                shape,
                supportingTextNumberOfLines,
            }),
        [
            activeKey,
            close,
            defaultActiveKey,
            gap,
            onActive,
            onClose,
            shape,
            supportingTextNumberOfLines,
        ],
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
        data,
        id,
        renderItem: processRenderItem,
    });
};
