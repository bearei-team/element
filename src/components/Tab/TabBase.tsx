import {FC, ReactNode, useCallback, useEffect, useId, useMemo} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, Text, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater, useImmer} from 'use-immer';
import {AnimatedInterpolation, ComponentStatus} from '../Common/interface';
import {TabDataSource, TabProps} from './Tab';
import {ContentItem} from './Tab.styles';
import {TabItem, TabItemProps} from './TabItem/TabItem';
import {useAnimated} from './useAnimated';

export type ActiveIndicatorOffsetPosition = 'horizontalStart' | 'horizontalEnd';
export interface RenderProps extends TabProps {
    activeIndicatorOffsetPosition: ActiveIndicatorOffsetPosition;
    items: ReactNode;
    headerVisible: boolean;
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

export interface RenderItemOptions extends TabItemProps {
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
export interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

export type ProcessLayoutOptions = Pick<RenderProps, 'onLayout'> & ProcessEventOptions;
export type ProcessActiveOptions = Pick<RenderProps, 'onActive'> & ProcessEventOptions;
export type ProcessItemLabelTextLayoutOptions = ProcessEventOptions & {key?: string};

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

const processActive = ({setState, onActive}: ProcessActiveOptions, key?: string) => {
    if (!key) {
        return;
    }

    setState(draft => {
        if (draft.activeKey !== key) {
            return;
        }

        const draftActiveItemIndex = draft.data.findIndex(datum => datum.key === draft.activeKey);
        const nextActiveItemIndex = draft.data.findIndex(datum => datum.key === key);

        draft.activeIndicatorOffsetPosition =
            nextActiveItemIndex > draftActiveItemIndex ? 'horizontalEnd' : 'horizontalStart';

        draft.activeKey = key;
    });

    onActive?.(key);
};

const processInit = ({setState}: ProcessEventOptions, dataSources?: TabDataSource[]) =>
    dataSources &&
    setState(draft => {
        draft.data = dataSources;
        draft.status === 'idle' && (draft.status = 'succeeded');
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
        <ContentItem key={key ?? index} width={layout.width}>
            {typeof content === 'string' ? <Text>{content}</Text> : content}
        </ContentItem>
    ));
};

export const TabBase: FC<TabBaseProps> = ({
    data: dataSources,
    defaultActiveKey,
    headerVisible = true,
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
        data,
        itemLayout,
        layout,
    });

    const onActive = useCallback(
        (key?: string) => processActive({setState, onActive: renderProps.onActive}, key),
        [renderProps.onActive, setState],
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
        processInit({setState}, dataSources);
    }, [dataSources, setState]);

    if (status === 'idle') {
        return <></>;
    }

    return render({
        ...renderProps,
        activeIndicatorOffsetPosition,
        children,
        data,
        headerVisible,
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
