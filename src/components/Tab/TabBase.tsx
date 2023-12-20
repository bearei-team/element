import {FC, ReactNode, useCallback, useEffect, useId, useMemo} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, ViewStyle} from 'react-native';
import {useImmer} from 'use-immer';
import {AnimatedInterpolation} from '../Common/interface';
import {Item} from './Item/Item';
import {TabDataSource, TabProps} from './Tab';
import {ContentItem} from './Tab.styles';
import {useAnimated} from './useAnimated';

export interface RenderProps extends TabProps {
    items: ReactNode;
    activeIndicatorOffsetPosition: 'left' | 'right';
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        activeIndicatorLeft: AnimatedInterpolation;
        activeIndicatorPaddingHorizontal: number;
        activeIndicatorWidth: AnimatedInterpolation;
        contentInnerLeft: AnimatedInterpolation;
        height: number;
        itemWidth: number;
        width: number;
        headerHeight: AnimatedInterpolation;
    };
}

export interface TabBaseProps extends TabProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface RenderItemOptions {
    active?: boolean;
    data: TabDataSource[];
    onActive: (key: string) => void;
    onLabelTextLayout: (event: LayoutChangeEvent, key: string) => void;
    onLayout: (event: LayoutChangeEvent) => void;
}

export interface Data extends TabDataSource {
    active: boolean;
    labelTextLayout: Pick<LayoutRectangle, 'height' | 'width'>;
}

const initialState = {
    layout: {} as Pick<LayoutRectangle, 'height' | 'width'>,
    itemLayout: {} as Pick<LayoutRectangle, 'height' | 'width'>,
    data: [] as Data[],
    activeIndicatorOffsetPosition: 'left' as 'left' | 'right',
};

const renderItem = (options: RenderItemOptions) => {
    const {onActive, data, onLayout, onLabelTextLayout} = options;

    return data.map(datum => (
        <Item
            {...datum}
            indexKey={datum.key}
            key={datum.key}
            onLabelTextLayout={onLabelTextLayout}
            onLayout={onLayout}
            onPress={() => onActive(datum.key!)}
        />
    ));
};

export const TabBase: FC<TabBaseProps> = props => {
    const {
        data: dataSources,
        defaultActiveKey,
        onChange,
        onLayout,
        render,
        headerVisible = true,
        ...renderProps
    } = props;

    const id = useId();
    const [{activeIndicatorOffsetPosition, data, itemLayout, layout}, setState] =
        useImmer(initialState);

    const {activeIndicatorLeft, activeIndicatorWidth, contentInnerLeft, headerHeight} = useAnimated(
        {
            data,
            itemLayout,
            layout,
            headerVisible,
        },
    );

    const processLayout = (event: LayoutChangeEvent) => {
        const {height, width} = event.nativeEvent.layout;

        onLayout?.(event);
        setState(draft => {
            draft.layout = {height, width};
        });
    };

    const processItemLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const {height, width} = event.nativeEvent.layout;

            console.info(event.nativeEvent.layout);

            setState(draft => {
                if (typeof draft.itemLayout.width !== 'number') {
                    draft.itemLayout = {height, width};
                }
            });
        },
        [setState],
    );

    const processItemLabelTextLayout = useCallback(
        (event: LayoutChangeEvent, key: string) => {
            const {height, width} = event.nativeEvent.layout;

            setState(draft => {
                const dataItem = draft.data.find(datum => datum.key === key);

                dataItem && (dataItem.labelTextLayout = {height, width});
            });
        },
        [setState],
    );

    const handleActive = useCallback(
        (key: string) => {
            setState(draft => {
                const draftActiveItemIndex = draft.data.findIndex(({active}) => active);
                const nextActiveItemIndex = draft.data.findIndex(datum => datum.key === key);

                draft.data.forEach(datum => (datum.active = datum.key === key));
                draft.activeIndicatorOffsetPosition =
                    nextActiveItemIndex > draftActiveItemIndex ? 'right' : 'left';
            });

            onChange?.(key);
        },
        [onChange, setState],
    );

    const processRenderItem = useCallback(
        () =>
            renderItem({
                data,
                onActive: handleActive,
                onLabelTextLayout: processItemLabelTextLayout,
                onLayout: processItemLayout,
            }),
        [data, handleActive, processItemLabelTextLayout, processItemLayout],
    );

    const items = useMemo(() => processRenderItem(), [processRenderItem]);
    const children = useMemo(
        () =>
            typeof layout.width === 'number' &&
            data.map(({content, key}, index) => (
                <ContentItem key={key ?? index} width={layout.width}>
                    {content}
                </ContentItem>
            )),
        [data, layout.width],
    );

    useEffect(() => {
        dataSources &&
            setState(draft => {
                draft.data = dataSources.map((datum, index) => ({
                    ...datum,
                    active: defaultActiveKey ? datum.key === defaultActiveKey : index === 0,
                    key: datum.key ?? `${index}`,
                    labelTextLayout: {} as Pick<LayoutRectangle, 'height' | 'width'>,
                }));
            });
    }, [dataSources, defaultActiveKey, setState]);

    return render({
        ...renderProps,
        data,
        items,
        id,
        onLayout: processLayout,
        activeIndicatorOffsetPosition,
        children,
        renderStyle: {
            activeIndicatorLeft,
            activeIndicatorWidth,
            contentInnerLeft,
            headerHeight,
            height: layout.height,
            itemWidth: itemLayout.width,
            width: layout.width,
            activeIndicatorPaddingHorizontal:
                ((itemLayout.width ?? 0) -
                    (data.find(({active}) => active)?.labelTextLayout.width ?? 0)) /
                2,
        },
    });
};
