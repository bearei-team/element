import {FC, ReactNode, useEffect, useId, useMemo} from 'react';
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
    onTriggerIndicatorHoverIn: () => void;
    onContentHoverIn: () => void;
    headerVisible: boolean;
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        activeIndicatorLeft: AnimatedInterpolation;
        activeIndicatorPaddingHorizontal: number;
        activeIndicatorWidth: AnimatedInterpolation;
        contentInnerLeft: AnimatedInterpolation;
        headerTranslateY: AnimatedInterpolation;
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
export interface ProcessEventOptions {
    setState?: Updater<typeof initialState>;
}

export type ProcessLayoutOptions = Partial<Pick<RenderProps, 'onLayout'> & ProcessEventOptions>;
export type ProcessActiveOptions = Partial<Pick<RenderProps, 'onActive'> & ProcessEventOptions>;

const processLayout =
    ({setState, onLayout}: ProcessLayoutOptions) =>
    (event: LayoutChangeEvent) => {
        const nativeEventLayout = event.nativeEvent.layout;

        setState?.(draft => {
            draft.layout = nativeEventLayout;
        });

        onLayout?.(event);
    };

const processItemLayout =
    ({setState}: ProcessEventOptions) =>
    (event: LayoutChangeEvent) => {
        const nativeEventLayout = event.nativeEvent.layout;

        setState?.(draft => {
            if (!draft.itemLayout.width) {
                draft.itemLayout = nativeEventLayout;
            }
        });
    };

const processItemLabelTextLayout =
    ({setState}: ProcessEventOptions) =>
    (event: LayoutChangeEvent, key?: string) => {
        const nativeEventLayout = event.nativeEvent.layout;

        setState?.(draft => {
            const dataItem = draft.data.find(datum => datum.key === key);

            if (!dataItem) {
                return;
            }

            dataItem.labelTextLayout = nativeEventLayout;
        });
    };

const processActive =
    ({setState, onActive}: ProcessActiveOptions) =>
    (key?: string) => {
        setState?.(draft => {
            if (draft.activeKey !== key) {
                const draftActiveItemIndex = draft.data.findIndex(
                    datum => datum.key === draft.activeKey,
                );

                const nextActiveItemIndex = draft.data.findIndex(datum => datum.key === key);

                draft.activeIndicatorOffsetPosition =
                    nextActiveItemIndex > draftActiveItemIndex
                        ? 'horizontalEnd'
                        : 'horizontalStart';

                draft.activeKey = key;
            }
        });

        onActive?.(key);
    };

const processTriggerIndicatorHoverIn =
    ({setState}: ProcessEventOptions) =>
    () =>
        setState?.(draft => {
            draft.headerVisible = true;
        });

const processContentHoverIn =
    ({setState}: ProcessEventOptions) =>
    () =>
        setState?.(draft => {
            if (draft.headerVisible) {
                draft.headerVisible = false;
            }
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

const initialState = {
    activeIndicatorOffsetPosition: 'horizontalStart' as ActiveIndicatorOffsetPosition,
    activeKey: undefined as string | undefined,
    data: [] as Data,
    headerVisible: false,
    itemLayout: {} as LayoutRectangle,
    layout: {} as LayoutRectangle,
    status: 'idle' as ComponentStatus,
};

export const TabBase: FC<TabBaseProps> = ({
    data: dataSources,
    defaultActiveKey,
    headerPosition = 'verticalStart',
    render,
    ...renderProps
}) => {
    const [
        {activeIndicatorOffsetPosition, activeKey, data, itemLayout, layout, status, headerVisible},
        setState,
    ] = useImmer(initialState);

    const id = useId();
    const theme = useTheme();
    const activeData = data.find(({key}) => key === activeKey);
    const activeDataLabelTextWidth = activeData?.labelTextLayout?.width ?? 0;
    const activeIndicatorBaseWidth = theme.spacing.large - theme.spacing.extraSmall;
    const activeIndicatorPaddingHorizontal =
        ((itemLayout.width ?? 0) - activeDataLabelTextWidth) / 2 +
        (activeDataLabelTextWidth - activeIndicatorBaseWidth) / 2;

    const [{activeIndicatorLeft, activeIndicatorWidth, contentInnerLeft, headerTranslateY}] =
        useAnimated({
            activeIndicatorBaseWidth,
            activeKey,
            data,
            headerVisible,
            itemLayout,
            layout,
        });

    const onActive = useMemo(
        () => processActive({setState, onActive: renderProps.onActive}),
        [renderProps.onActive, setState],
    );

    const onLayout = useMemo(
        () => processLayout({setState, onLayout: renderProps.onLayout}),
        [renderProps.onLayout, setState],
    );

    const onContentHoverIn = useMemo(() => processContentHoverIn({setState}), [setState]);
    const onItemLayout = useMemo(() => processItemLayout({setState}), [setState]);
    const onLabelTextLayout = useMemo(() => processItemLabelTextLayout({setState}), [setState]);
    const onTriggerIndicatorHoverIn = useMemo(
        () => processTriggerIndicatorHoverIn({setState}),
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

    const children = useMemo(() => {
        if (typeof layout.width !== 'number') {
            return <></>;
        }

        return data.map(({content, key}, index) => (
            <ContentItem key={key ?? index} width={layout.width}>
                {typeof content === 'string' ? <Text>{content}</Text> : content}
            </ContentItem>
        ));
    }, [data, layout.width]);

    useEffect(() => {
        if (dataSources) {
            setState(draft => {
                draft.data = dataSources;
                draft.status === 'idle' && (draft.status = 'succeeded');
            });
        }
    }, [dataSources, setState]);

    if (status === 'idle') {
        return <></>;
    }

    return render({
        ...renderProps,
        activeIndicatorOffsetPosition,
        children,
        data,
        headerPosition,
        headerVisible,
        id,
        items,
        onContentHoverIn,
        onLayout,
        onTriggerIndicatorHoverIn,
        renderStyle: {
            activeIndicatorLeft,
            activeIndicatorPaddingHorizontal,
            activeIndicatorWidth,
            contentInnerLeft,
            headerTranslateY,
            height: layout.height,
            itemWidth: itemLayout.width,
            width: layout.width,
        },
    });
};
