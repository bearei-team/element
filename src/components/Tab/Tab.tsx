import {FC, ReactNode, RefAttributes, forwardRef, memo} from 'react';
import {Animated, View, ViewProps} from 'react-native';
import {Divider} from '../Divider/Divider';
import {Elevation} from '../Elevation/Elevation';
import {
    ActiveIndicator,
    ActiveIndicatorInner,
    Container,
    Content,
    ContentInner,
    Header,
    HeaderInner,
    HeaderScrollView,
    TriggerIndicator,
} from './Tab.styles';
import {RenderProps, TabBase} from './TabBase';
import {TabItemProps} from './TabItem/TabItem';

export type TabType = 'primary' | 'secondary';
export interface TabDataSource extends Pick<TabItemProps, 'labelText'> {
    content?: ReactNode;
    key?: string;
}

export interface TabProps extends Partial<ViewProps & RefAttributes<View>> {
    autohide?: boolean;
    data?: TabDataSource[];
    defaultActiveKey?: string;
    headerPosition?: 'verticalStart' | 'verticalEnd';
    onActive?: (key?: string) => void;
    type?: TabType;
}

/**
 * TODO: secondary and icon,Autohide Head
 */

const AnimatedActiveIndicator = Animated.createAnimatedComponent(ActiveIndicator);
const AnimatedActiveIndicatorInner = Animated.createAnimatedComponent(ActiveIndicatorInner);
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
            autohide,
            headerPosition,
            onTriggerIndicatorHoverIn,
            onContentHoverIn,
            ...containerProps
        } = renderProps;

        const {
            activeIndicatorLeft,
            activeIndicatorPaddingHorizontal,
            activeIndicatorWidth,
            contentInnerLeft,
            itemWidth,
            headerTranslateY,
            width,
        } = renderStyle;

        return (
            <Container {...containerProps} testID={`tab--${id}`}>
                <AnimatedHeader
                    autohide={autohide}
                    headerPosition={headerPosition}
                    testID={`tab__header--${id}`}
                    style={{transform: [{translateY: headerTranslateY}]}}>
                    {headerPosition === 'verticalEnd' && <Divider size="large" width={width} />}

                    <Elevation defaultLevel={autohide ? 3 : 0}>
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
                    </Elevation>

                    {headerPosition === 'verticalStart' && <Divider size="large" width={width} />}
                </AnimatedHeader>

                {autohide && (
                    <TriggerIndicator
                        headerPosition={headerPosition}
                        onHoverIn={onTriggerIndicatorHoverIn}
                    />
                )}

                <Content testID={`tab__content--${id}`} onHoverIn={onContentHoverIn}>
                    <AnimatedContentInner
                        style={{left: contentInnerLeft}}
                        testID={`tab__contentInner--${id}`}>
                        {children}
                    </AnimatedContentInner>
                </Content>
            </Container>
        );
    };

    return <TabBase {...props} ref={ref} render={render} />;
});

export const Tab: FC<TabProps> = memo(ForwardRefTab);
