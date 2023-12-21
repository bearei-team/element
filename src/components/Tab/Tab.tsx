import {FC, ReactNode, RefAttributes, forwardRef, memo} from 'react';
import {Animated, View, ViewProps} from 'react-native';
import {Divider} from '../Divider/Divider';
import {ItemProps} from './Item/Item';
import {
    ActiveIndicator,
    ActiveIndicatorInner,
    Container,
    Content,
    ContentInner,
    Header,
    HeaderInner,
    HeaderScrollView,
} from './Tab.styles';
import {RenderProps, TabBase} from './TabBase';

export type TabType = 'primary' | 'secondary';
export interface TabDataSource extends Pick<ItemProps, 'labelText'> {
    content?: ReactNode;
    key?: string;
}

export interface TabProps extends Partial<ViewProps & RefAttributes<View>> {
    data?: TabDataSource[];
    defaultActiveKey?: string;
    headerVisible?: boolean;
    onChange?: (key: string) => void;
    type?: TabType;
}

/**
 * TODO: secondary and icon
 */

const AnimatedActiveIndicator =
    Animated.createAnimatedComponent(ActiveIndicator);

const AnimatedActiveIndicatorInner =
    Animated.createAnimatedComponent(ActiveIndicatorInner);

const AnimatedContentInner = Animated.createAnimatedComponent(ContentInner);
const AnimatedHeader = Animated.createAnimatedComponent(Header);
const ForwardRefTab = forwardRef<View, TabProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            activeIndicatorOffsetPosition,
            children,
            id,
            items,
            renderStyle,
            ...containerProps
        } = renderProps;

        const {
            activeIndicatorLeft,
            activeIndicatorPaddingHorizontal,
            activeIndicatorWidth,
            contentInnerLeft,
            headerHeight,
            itemWidth,
            width,
        } = renderStyle;

        return (
            <Container {...containerProps} ref={ref} testID={`tab--${id}`}>
                <AnimatedHeader
                    testID={`tab__header--${id}`}
                    style={{height: headerHeight}}>
                    <HeaderScrollView
                        horizontal={true}
                        centerContent={true}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        testID={`tab__headerScrollView--${id}`}>
                        <HeaderInner>
                            {items}
                            {typeof itemWidth === 'number' && (
                                <AnimatedActiveIndicator
                                    offsetPosition={
                                        activeIndicatorOffsetPosition
                                    }
                                    paddingHorizontal={
                                        activeIndicatorPaddingHorizontal
                                    }
                                    style={{left: activeIndicatorLeft}}
                                    testID={`tab__activeIndicator--${id}`}
                                    width={itemWidth}>
                                    <AnimatedActiveIndicatorInner
                                        shape="extraSmallTop"
                                        style={{
                                            width: activeIndicatorWidth,
                                        }}
                                        testID={`tab__activeIndicatorInner--${id}`}
                                    />
                                </AnimatedActiveIndicator>
                            )}
                        </HeaderInner>
                    </HeaderScrollView>
                </AnimatedHeader>

                {typeof width === 'number' && (
                    <Divider size="large" width={width} />
                )}

                <Content testID={`tab__content--${id}`}>
                    <AnimatedContentInner
                        style={{left: contentInnerLeft}}
                        testID={`tab__contentInner--${id}`}>
                        {children}
                    </AnimatedContentInner>
                </Content>
            </Container>
        );
    };

    return <TabBase {...props} render={render} />;
});

export const Tab: FC<TabProps> = memo(ForwardRefTab);
