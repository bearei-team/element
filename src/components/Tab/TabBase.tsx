import {FC, ReactNode, RefAttributes, useCallback, useEffect, useId, useMemo} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    Text,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater, useImmer} from 'use-immer';
import {AnimatedInterpolation, ComponentStatus} from '../Common/interface';
import {ContentItem} from './Tab.styles';
import {TabItem, TabItemProps} from './TabItem/TabItem';
import {useAnimated} from './useAnimated';

type TabType = 'primary' | 'secondary';
export interface TabDataSource extends Pick<TabItemProps, 'labelText'> {
    content?: ReactNode;
    key?: string;
}

export interface TabProps extends Partial<ViewProps & RefAttributes<View>> {
    activeKey?: string;
    data?: TabDataSource[];
    defaultActiveKey?: string;
    onActive?: (key?: string) => void;
    type?: TabType;
}

type ActiveIndicatorOffsetPosition = 'horizontalStart' | 'horizontalEnd';
export interface RenderProps extends TabProps {
    activeIndicatorOffsetPosition: ActiveIndicatorOffsetPosition;
    items: ReactNode;
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        activeIndicatorLeft: AnimatedInterpolation;
        activeIndicatorPaddingHorizontal: number;
        activeIndicatorWidth: AnimatedInterpolation;
        contentInnerLeft: AnimatedInterpolation;
        height: number;
        itemWidth: number;
        width: number;
    };
}

export interface TabBaseProps extends TabProps {
    render: (props: RenderProps) => React.JSX.Element;
}

interface RenderItemOptions extends TabItemProps {
    data: TabDataSource[];
}

export type Data = (TabDataSource & {labelTextLayout?: LayoutRectangle})[];
export interface InitialState {
    activeIndicatorOffsetPosition: ActiveIndicatorOffsetPosition;
    activeKey?: string;
    data: Data;
    itemLayout: LayoutRectangle;
    layout: LayoutRectangle;
    status: ComponentStatus;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessLayoutOptions = Pick<RenderProps, 'onLayout'> & ProcessEventOptions;
type ProcessActiveOptions = Pick<RenderProps, 'onActive'> & ProcessEventOptions;
type ProcessItemLabelTextLayoutOptions = ProcessEventOptions & {key?: string};
type ProcessActiveKeyOptions = ProcessEventOptions & Pick<RenderProps, 'activeKey'>;

const processLayout = (event: LayoutChangeEvent, {setState, onLayout}: ProcessLayoutOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });

    onLayout?.(event);
};

const processItemLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        !draft.itemLayout.width && (draft.itemLayout = nativeEventLayout);

        draft.status === 'idle' && (draft.status = 'succeeded');
    });
};

const processItemLabelTextLayout = (
    event: LayoutChangeEvent,
    {key, setState}: ProcessItemLabelTextLayoutOptions,
) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        const dataItem = draft.data.find(datum => datum.key === key);

        dataItem && (dataItem.labelTextLayout = nativeEventLayout);
    });
};

const processActive = ({setState, onActive}: ProcessActiveOptions, key?: string) =>
    typeof key === 'string' &&
    setState(draft => {
        if (draft.activeKey === key) {
            return;
        }

        const draftActiveItemIndex = draft.data.findIndex(datum => datum.key === draft.activeKey);
        const nextActiveItemIndex = draft.data.findIndex(datum => datum.key === key);

        draft.activeIndicatorOffsetPosition =
            nextActiveItemIndex > draftActiveItemIndex ? 'horizontalEnd' : 'horizontalStart';

        draft.activeKey = key;

        onActive?.(key);
    });

const processActiveKey = ({activeKey, setState}: ProcessActiveKeyOptions) =>
    typeof activeKey === 'string' &&
    setState(draft => {
        if (draft.status !== 'succeeded' || draft.activeKey === activeKey) {
            return;
        }

        const draftActiveItemIndex = draft.data.findIndex(datum => datum.key === draft.activeKey);
        const nextActiveItemIndex = draft.data.findIndex(datum => datum.key === activeKey);

        draft.activeIndicatorOffsetPosition =
            nextActiveItemIndex > draftActiveItemIndex ? 'horizontalEnd' : 'horizontalStart';

        draft.activeKey = activeKey;
    });

const processInit = ({setState}: ProcessEventOptions, dataSources?: TabDataSource[]) =>
    dataSources &&
    setState(draft => {
        draft.data = dataSources;
        // draft.status === 'idle' && (draft.status = 'succeeded');
    });

const renderItem = ({
    data,
    onActive,
    onLayout,
    onLabelTextLayout,
    defaultActiveKey,
    activeKey,
}: RenderItemOptions) =>
    data.map(datum => (
        <TabItem
            {...datum}
            activeKey={activeKey}
            defaultActiveKey={defaultActiveKey}
            indexKey={datum.key}
            key={datum.key}
            onActive={onActive}
            onLabelTextLayout={onLabelTextLayout}
            onLayout={onLayout}
        />
    ));

const renderChildren = (data: Data, {layout}: Pick<InitialState, 'layout'>) => {
    if (typeof layout.width !== 'number') {
        return <></>;
    }

    return data.map(({content, key}, index) => (
        <ContentItem key={key ?? index} renderStyle={{width: layout.width}}>
            {typeof content === 'string' ? <Text>{content}</Text> : content}
        </ContentItem>
    ));
};

export const TabBase: FC<TabBaseProps> = ({
    activeKey: activeKeySource,
    data: dataSources,
    defaultActiveKey,
    onActive: onActiveSource,
    render,
    ...renderProps
}) => {
    const [{activeIndicatorOffsetPosition, activeKey, data, itemLayout, layout, status}, setState] =
        useImmer<InitialState>({
            activeIndicatorOffsetPosition: 'horizontalStart',
            activeKey: undefined,
            data: [],
            itemLayout: {} as LayoutRectangle,
            layout: {} as LayoutRectangle,
            status: 'idle',
        });

    const id = useId();
    const theme = useTheme();
    const activeData = data.find(({key}) => key === activeKey);
    const activeDataLabelTextWidth = activeData?.labelTextLayout?.width ?? 0;
    const activeIndicatorBaseWidth = theme.spacing.large - theme.spacing.extraSmall;
    const activeIndicatorPaddingHorizontal =
        ((itemLayout.width ?? 0) - activeDataLabelTextWidth) / 2 +
        (activeDataLabelTextWidth - activeIndicatorBaseWidth) / 2;

    const [{activeIndicatorLeft, activeIndicatorWidth, contentInnerLeft}] = useAnimated({
        activeIndicatorBaseWidth,
        activeKey,
        data: dataSources,
        defaultActiveKey,
        itemLayout,
        layout,
        setState,
    });

    const onActive = useCallback(
        (key?: string) => processActive({setState, onActive: onActiveSource}, key),
        [onActiveSource, setState],
    );

    const onLayout = useCallback(
        (event: LayoutChangeEvent) =>
            processLayout(event, {setState, onLayout: renderProps.onLayout}),
        [renderProps.onLayout, setState],
    );

    const onItemLayout = useCallback(
        (event: LayoutChangeEvent) => processItemLayout(event, {setState}),
        [setState],
    );

    const onLabelTextLayout = useCallback(
        (event: LayoutChangeEvent, key?: string) =>
            processItemLabelTextLayout(event, {key, setState}),
        [setState],
    );

    const items = useMemo(
        () =>
            renderItem({
                activeKey,
                data,
                defaultActiveKey,
                onActive,
                onLabelTextLayout,
                onLayout: onItemLayout,
            }),
        [activeKey, data, defaultActiveKey, onActive, onItemLayout, onLabelTextLayout],
    );

    const children = useMemo(() => renderChildren(data, {layout}), [data, layout]);

    useEffect(() => {
        console.info(activeKeySource, 'activeKeySource');
        processActiveKey({activeKey: activeKeySource, setState});
    }, [activeKeySource, setState]);

    useEffect(() => {
        processInit({setState}, dataSources);
    }, [dataSources, setState]);

    // if (status === 'idle') {
    //     return <></>;
    // }

    return render({
        ...renderProps,
        activeIndicatorOffsetPosition,
        children,
        data,
        id,
        items,
        onLayout,
        renderStyle: {
            activeIndicatorLeft,
            activeIndicatorPaddingHorizontal,
            activeIndicatorWidth,
            contentInnerLeft,
            height: layout.height,
            itemWidth: itemLayout.width,
            width: layout.width,
        },
    });
};
