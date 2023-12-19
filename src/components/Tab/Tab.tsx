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
    HeaderContent,
    HeaderInner,
} from './Tab.styles';
import {RenderProps, TabBase} from './TabBase';

export type TabType = 'primary' | 'secondary';
export interface TabDataSource extends Pick<ItemProps, 'labelText'> {
    key?: string;
    content?: ReactNode;
}

export interface TabProps extends Partial<ViewProps & RefAttributes<View>> {
    type?: TabType;
    data?: TabDataSource[];
    onChange?: (key: string) => void;
    defaultActiveKey?: string;
    headerVisible?: boolean;
}

/**
 * TODO: secondary and icon
 */

const AnimatedActiveIndicator = Animated.createAnimatedComponent(ActiveIndicator);
const AnimatedActiveIndicatorInner = Animated.createAnimatedComponent(ActiveIndicatorInner);
const AnimatedContentInner = Animated.createAnimatedComponent(ContentInner);
const AnimatedHeaderInner = Animated.createAnimatedComponent(HeaderInner);
const ForwardRefTab = forwardRef<View, TabProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            activeIndicatorOffsetPosition,
            children,
            id,
            items,
            onLayout,
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
            <Container {...containerProps} onLayout={onLayout} ref={ref} testID={`tab--${id}`}>
                <Header horizontal={true} testID={`tab__header--${id}`}>
                    <AnimatedHeaderInner
                        width={width}
                        testID={`tab__headerInner--${id}`}
                        style={{height: headerHeight}}>
                        <HeaderContent testID={`tab__headerContent--${id}`}>
                            {items}
                            {typeof itemWidth === 'number' && (
                                <AnimatedActiveIndicator
                                    offsetPosition={activeIndicatorOffsetPosition}
                                    paddingHorizontal={activeIndicatorPaddingHorizontal}
                                    style={{left: activeIndicatorLeft}}
                                    testID={`tab__activeIndicator--${id}`}
                                    width={itemWidth}>
                                    <AnimatedActiveIndicatorInner
                                        shape="extraSmallTop"
                                        style={{width: activeIndicatorWidth}}
                                        testID={`tab__activeIndicatorInner--${id}`}
                                    />
                                </AnimatedActiveIndicator>
                            )}
                        </HeaderContent>
                    </AnimatedHeaderInner>
                </Header>

                <Divider size="large" width={width} />
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
