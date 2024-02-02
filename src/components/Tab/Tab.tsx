import {FC, ReactNode, RefAttributes, forwardRef, memo} from 'react';
import {Animated, View, ViewProps} from 'react-native';
import {Divider} from '../Divider/Divider';
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
import {TabItemProps} from './TabItem/TabItem';

export type TabType = 'primary' | 'secondary';
export interface TabDataSource extends Pick<TabItemProps, 'labelText'> {
    content?: ReactNode;
    key?: string;
}

export interface TabProps extends Partial<ViewProps & RefAttributes<View>> {
    activeKey?: string;
    data?: TabDataSource[];
    defaultActiveKey?: string;
    headerVisible?: boolean;
    onActive?: (key?: string) => void;
    type?: TabType;
}

/**
 * TODO: secondary and icon,Autohide Head
 */

const AnimatedActiveIndicator = Animated.createAnimatedComponent(ActiveIndicator);
const AnimatedActiveIndicatorInner = Animated.createAnimatedComponent(ActiveIndicatorInner);
const AnimatedContentInner = Animated.createAnimatedComponent(ContentInner);
const render = ({
    activeIndicatorOffsetPosition,
    children,
    headerVisible,
    id,
    items,
    renderStyle,
    ...containerProps
}: RenderProps) => {
    const {
        activeIndicatorLeft,
        activeIndicatorPaddingHorizontal,
        activeIndicatorWidth,
        contentInnerLeft,
        itemWidth,
        width,
    } = renderStyle;

    return (
        <Container {...containerProps} testID={`tab--${id}`}>
            {headerVisible && (
                <Header testID={`tab__header--${id}`}>
                    <HeaderScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        testID={`tab__headerScrollView--${id}`}>
                        <HeaderInner testID={`tab__headerInner--${id}`} width={width}>
                            {items}
                            <AnimatedActiveIndicator
                                activeIndicatorOffsetPosition={activeIndicatorOffsetPosition}
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
                        </HeaderInner>
                    </HeaderScrollView>

                    <Divider size="large" width={width} />
                </Header>
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

const ForwardRefTab = forwardRef<View, TabProps>((props, ref) => (
    <TabBase {...props} ref={ref} render={render} />
));

export const Tab: FC<TabProps> = memo(ForwardRefTab);
