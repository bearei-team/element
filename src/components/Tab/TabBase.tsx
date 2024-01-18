import {FC, ReactNode, useCallback, useEffect, useId, useMemo} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, Text, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useImmer} from 'use-immer';
import {AnimatedInterpolation, ComponentStatus} from '../Common/interface';
import {TabDataSource, TabProps} from './Tab';
import {ContentItem} from './Tab.styles';
import {TabItem, TabItemProps} from './TabItem/TabItem';
import {useAnimated} from './useAnimated';
export interface RenderProps extends TabProps {
    activeIndicatorOffsetPosition: 'left' | 'right';
    items: ReactNode;
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        activeIndicatorLeft: AnimatedInterpolation;
        activeIndicatorPaddingHorizontal: number;
        activeIndicatorWidth: AnimatedInterpolation;
        contentInnerLeft: AnimatedInterpolation;
        headerHeight: AnimatedInterpolation;
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

const initialState = {
    activeIndicatorOffsetPosition: 'left' as 'left' | 'right',
    activeKey: undefined as string | undefined,
    data: [] as Data,
    itemLayout: {} as LayoutRectangle,
    layout: {} as LayoutRectangle,
    status: 'idle' as ComponentStatus,
};

const renderItem = (options: RenderItemOptions) => {
    const {data, onActive, onLayout, onLabelTextLayout, defaultActiveKey, activeKey} = options;

    return data.map(datum => (
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
};

export const TabBase: FC<TabBaseProps> = props => {
    const {data: dataSources, defaultActiveKey, onActive, onLayout, render, ...renderProps} = props;
    const [{activeIndicatorOffsetPosition, activeKey, data, itemLayout, layout, status}, setState] =
        useImmer(initialState);

    const id = useId();
    const theme = useTheme();
    const activeData = data.find(({key}) => key === activeKey);
    const activeDataLabelTextWidth = activeData?.labelTextLayout?.width ?? 0;
    const activeIndicatorBaseWidth = theme.spacing.large - theme.spacing.extraSmall;
    const activeIndicatorPaddingHorizontal =
        ((itemLayout.width ?? 0) - activeDataLabelTextWidth) / 2 +
        (activeDataLabelTextWidth - activeIndicatorBaseWidth) / 2;

    const [{activeIndicatorLeft, activeIndicatorWidth, contentInnerLeft, headerHeight}] =
        useAnimated({
            activeIndicatorBaseWidth,
            activeKey,
            data,
            headerVisible: false,
            itemLayout,
            layout,
        });

    const processLayout = (event: LayoutChangeEvent) => {
        const nativeEventLayout = event.nativeEvent.layout;

        setState(draft => {
            draft.layout = nativeEventLayout;
        });

        onLayout?.(event);
    };

    const processItemLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const nativeEventLayout = event.nativeEvent.layout;

            setState(draft => {
                if (!draft.itemLayout.width) {
                    draft.itemLayout = nativeEventLayout;
                }
            });
        },
        [setState],
    );

    const processItemLabelTextLayout = useCallback(
        (event: LayoutChangeEvent, key?: string) => {
            const nativeEventLayout = event.nativeEvent.layout;

            setState(draft => {
                const dataItem = draft.data.find(datum => datum.key === key);

                if (!dataItem) {
                    return;
                }

                dataItem.labelTextLayout = nativeEventLayout;
            });
        },
        [setState],
    );

    const handleActive = useCallback(
        (key?: string) => {
            setState(draft => {
                if (draft.activeKey !== key) {
                    const draftActiveItemIndex = draft.data.findIndex(
                        datum => datum.key === draft.activeKey,
                    );

                    const nextActiveItemIndex = draft.data.findIndex(datum => datum.key === key);

                    draft.activeIndicatorOffsetPosition =
                        nextActiveItemIndex > draftActiveItemIndex ? 'right' : 'left';

                    draft.activeKey = key;
                }
            });

            onActive?.(key);
        },
        [onActive, setState],
    );

    const items = useMemo(
        () =>
            renderItem({
                activeKey,
                data,
                defaultActiveKey,
                onActive: handleActive,
                onLabelTextLayout: processItemLabelTextLayout,
                onLayout: processItemLayout,
            }),
        [
            activeKey,
            data,
            defaultActiveKey,
            handleActive,
            processItemLabelTextLayout,
            processItemLayout,
        ],
    );

    const children = useMemo(
        () =>
            typeof layout.width === 'number' &&
            data.map(({content, key}, index) => (
                <ContentItem key={key ?? index} width={layout.width}>
                    {typeof content === 'string' ? <Text>{content}</Text> : content}
                </ContentItem>
            )),
        [data, layout.width],
    );

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
        id,
        items,
        onLayout: processLayout,
        renderStyle: {
            activeIndicatorLeft,
            activeIndicatorPaddingHorizontal,
            activeIndicatorWidth,
            contentInnerLeft,
            headerHeight,
            height: layout.height,
            itemWidth: itemLayout.width,
            width: layout.width,
        },
    });
};
