import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
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
import {RenderProps, TabBase, TabProps} from './TabBase';

const AnimatedActiveIndicator = Animated.createAnimatedComponent(ActiveIndicator);
const AnimatedActiveIndicatorInner = Animated.createAnimatedComponent(ActiveIndicatorInner);
const AnimatedContentInner = Animated.createAnimatedComponent(ContentInner);
const render = ({
    activeIndicatorOffsetPosition,
    children,
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
            <Header testID={`tab__header--${id}`}>
                <HeaderScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    testID={`tab__headerScrollView--${id}`}>
                    <HeaderInner testID={`tab__headerInner--${id}`} renderStyle={{width}}>
                        {items}
                        <AnimatedActiveIndicator
                            activeIndicatorOffsetPosition={activeIndicatorOffsetPosition}
                            renderStyle={{
                                paddingHorizontal: activeIndicatorPaddingHorizontal,
                                width: itemWidth,
                            }}
                            style={{left: activeIndicatorLeft}}
                            testID={`tab__activeIndicator--${id}`}>
                            <AnimatedActiveIndicatorInner
                                shape="extraSmallTop"
                                style={{width: activeIndicatorWidth}}
                                testID={`tab__activeIndicatorInner--${id}`}
                            />
                        </AnimatedActiveIndicator>
                    </HeaderInner>
                </HeaderScrollView>

                <Divider size="large" renderStyle={{width}} />
            </Header>

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
export type {TabProps};
