import {RefAttributes, forwardRef, useCallback, useEffect, useId, useMemo} from 'react';
import {LayoutChangeEvent, LayoutRectangle, View, ViewProps} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {ShapeProps} from '../Common/Common.styles';
import {ComponentStatus, State} from '../Common/interface';
import {ListDataSource} from '../List/List';
import {
    NavigationBarItem,
    NavigationBarItemProps,
    NavigationBarType,
} from './NavigationBarItem/NavigationBarItem';

export interface NavigationDataSource extends NavigationBarItemProps {
    key?: string;
}

type BaseProps = Partial<
    Pick<NavigationBarItemProps, 'activeKey' | 'onActive' | 'type'> &
        ViewProps &
        RefAttributes<View> &
        Pick<ShapeProps, 'shape'>
>;

export interface NavigationBarProps extends BaseProps {
    block?: boolean;
    data?: NavigationDataSource[];
    defaultActiveKey?: string;
}

export interface RenderProps extends NavigationBarProps {
    onDestinationLayout: (event: LayoutChangeEvent) => void;
    onEvent: OnEvent;
    renderStyle: {
        destinationHeight: number;
        destinationWidth: number;
        height: number;
        width: number;
    };
}

interface NavigationBaseProps extends NavigationBarProps {
    render: (props: RenderProps) => React.JSX.Element;
}

interface InitialState {
    activeKey?: string;
    data: ListDataSource[];
    destinationLayout: LayoutRectangle;
    layout: LayoutRectangle;
    status: ComponentStatus;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

interface RenderItemOptions {
    active?: boolean;
    activeKey?: string;
    data: ListDataSource[];
    onActive: (value?: string) => void;
    type?: NavigationBarType;
}

type ProcessActiveOptions = ProcessEventOptions & Pick<RenderProps, 'onActive'>;
type ProcessDestinationLayoutOptions = Pick<RenderProps, 'block'> & ProcessEventOptions;
type ProcessLayoutOptions = Pick<RenderProps, 'block'> & ProcessEventOptions;
type ProcessStateChangeOptions = OnStateChangeOptions & ProcessLayoutOptions;

const renderItems = (
    status: ComponentStatus,
    {activeKey, type, data, onActive}: RenderItemOptions,
) =>
    status === 'succeeded' &&
    data.map(({key, ...props}) => (
        <NavigationBarItem
            {...props}
            activeKey={activeKey}
            type={type}
            dataKey={key}
            key={key}
            onActive={onActive}
        />
    ));

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

const processDestinationLayout = (
    event: LayoutChangeEvent,
    {block, setState}: ProcessDestinationLayoutOptions,
) => {
    if (block) {
        return;
    }

    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        const update =
            draft.destinationLayout.width !== nativeEventLayout.width ||
            draft.destinationLayout.height !== nativeEventLayout.height;

        update && (draft.destinationLayout = nativeEventLayout);
    });
};

const processLayout = (event: LayoutChangeEvent, {block, setState}: ProcessLayoutOptions) => {
    if (!block) {
        return;
    }

    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        const update =
            draft.layout.width !== nativeEventLayout.width ||
            draft.layout.height !== nativeEventLayout.height;

        update && (draft.layout = nativeEventLayout);
    });
};

const processStateChange = (
    _state: State,
    {event, eventName, block, setState}: ProcessStateChangeOptions,
) => {
    eventName === 'layout' && processLayout(event as LayoutChangeEvent, {block, setState});
};

const processInit = ({setState}: ProcessEventOptions, dataSources?: ListDataSource[]) =>
    dataSources &&
    setState(draft => {
        draft.data = dataSources;
        draft.status = 'succeeded';
    });

export const NavigationBarBase = forwardRef<View, NavigationBaseProps>(
    (
        {
            activeKey: activeKeySource,
            block,
            data: dataSources,
            defaultActiveKey,
            render,
            onActive: onActiveSource,
            type,
            ...renderProps
        },
        ref,
    ) => {
        const [{activeKey, data, layout, destinationLayout, status}, setState] =
            useImmer<InitialState>({
                activeKey: undefined,
                data: [],
                status: 'idle',
                layout: {} as LayoutRectangle,
                destinationLayout: {} as LayoutRectangle,
            });

        const id = useId();
        const onActive = useCallback(
            (value?: string) => processActive({onActive: onActiveSource, setState}, value),
            [onActiveSource, setState],
        );

        const onDestinationLayout = useCallback(
            (event: LayoutChangeEvent) => processDestinationLayout(event, {block, setState}),
            [block, setState],
        );

        const onStateChange = useCallback(
            (state: State, options = {} as OnStateChangeOptions) =>
                processStateChange(state, {...options, block, setState}),
            [block, setState],
        );

        const [onEvent] = useOnEvent({...renderProps, onStateChange});
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
            id,
            onDestinationLayout,
            onEvent,
            block,
            ref,
            renderStyle: {
                destinationHeight: destinationLayout.height,
                destinationWidth: destinationLayout.width,
                height: layout.height,
                width: layout.width,
            },
        });
    },
);
