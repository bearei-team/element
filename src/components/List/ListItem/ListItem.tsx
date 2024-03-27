import {FC, forwardRef, memo} from 'react'
import {View} from 'react-native'
import Animated from 'react-native-reanimated'
import {TouchableRipple} from '../../TouchableRipple/TouchableRipple'
import {Underlay} from '../../Underlay/Underlay'
import {
    AfterAffordance,
    BeforeAffordance,
    Container,
    Content,
    Headline,
    Inner,
    Leading,
    Main,
    MainInner,
    SupportingText,
    Trailing
} from './ListItem.styles'
import {ListItemBase, ListItemProps, RenderProps} from './ListItemBase'

const AnimatedContainer = Animated.createAnimatedComponent(Container)
const AnimatedInner = Animated.createAnimatedComponent(Inner)
const AnimatedTrailing = Animated.createAnimatedComponent(Trailing)
const render = ({
    active,
    activeColor,
    afterAffordance,
    beforeAffordance,
    containerLayout,
    eventName,
    headline,
    id,
    itemGap,
    leading,
    onAddonAfterLayout,
    onContainerLayout,
    onEvent,
    onInnerLayout,
    renderStyle,
    shape,
    size,
    supporting,
    supportingTextNumberOfLines,
    touchableLocation,
    trailing,
    underlayColor,
    ...innerProps
}: RenderProps) => {
    const {containerAnimatedStyle, innerAnimatedStyle, trailingAnimatedStyle} =
        renderStyle

    const affordance = beforeAffordance || afterAffordance

    return (
        <AnimatedContainer
            accessibilityLabel={headline}
            accessibilityRole='list'
            onLayout={onContainerLayout}
            style={[containerAnimatedStyle]}
            testID={`listItem--${id}`}
        >
            <AnimatedInner
                {...(affordance && {shape})}
                itemGap={itemGap}
                onLayout={onInnerLayout}
                style={[innerAnimatedStyle]}
                testID={`listItem__inner--${id}`}
            >
                {beforeAffordance && (
                    <BeforeAffordance
                        onLayout={onAddonAfterLayout}
                        testID={`listItem__beforeAffordance--${id}`}
                    >
                        {beforeAffordance}
                    </BeforeAffordance>
                )}

                <Main
                    {...(!affordance && {shape})}
                    renderStyle={{width: containerLayout?.width}}
                    testID={`listItem_main--${id}`}
                >
                    <TouchableRipple
                        {...onEvent}
                        active={active}
                        touchableLocation={touchableLocation}
                        underlayColor={activeColor}
                    >
                        <MainInner
                            {...innerProps}
                            size={size}
                            testID={`listItem__inner--${id}`}
                        >
                            {leading && (
                                <Leading
                                    size={size}
                                    testID={`listItem__leading--${id}`}
                                >
                                    {leading}
                                </Leading>
                            )}

                            <Content
                                size={size}
                                supportingTextShow={
                                    !!(
                                        typeof supporting === 'string' &&
                                        supporting
                                    )
                                }
                                testID={`listItem__content--${id}`}
                            >
                                <Headline
                                    ellipsizeMode='tail'
                                    headlineSize={size}
                                    numberOfLines={1}
                                    size={size === 'small' ? 'medium' : 'large'}
                                    testID={`listItem__headline--${id}`}
                                    type='body'
                                >
                                    {headline}
                                </Headline>

                                {supporting &&
                                    size !== 'small' &&
                                    typeof supporting === 'string' && (
                                        <SupportingText
                                            ellipsizeMode='tail'
                                            numberOfLines={
                                                supportingTextNumberOfLines
                                            }
                                            size='medium'
                                            testID={`listItem__supportingText--${id}`}
                                            type='body'
                                        >
                                            {supporting}
                                        </SupportingText>
                                    )}

                                {supporting &&
                                    typeof supporting !== 'string' &&
                                    supporting}
                            </Content>

                            {trailing && (
                                <AnimatedTrailing
                                    size={size}
                                    style={[trailingAnimatedStyle]}
                                    testID={`listItem__trailingInner--${id}`}
                                >
                                    {trailing}
                                </AnimatedTrailing>
                            )}

                            <Underlay
                                eventName={eventName}
                                underlayColor={underlayColor}
                            />
                        </MainInner>
                    </TouchableRipple>
                </Main>

                {afterAffordance && (
                    <AfterAffordance
                        onLayout={onAddonAfterLayout}
                        testID={`listItem__afterAffordance--${id}`}
                    >
                        {afterAffordance}
                    </AfterAffordance>
                )}
            </AnimatedInner>
        </AnimatedContainer>
    )
}

const ForwardRefListItem = forwardRef<View, ListItemProps>((props, ref) => (
    <ListItemBase
        {...props}
        ref={ref}
        render={render}
    />
))

export const ListItem: FC<ListItemProps> = memo(ForwardRefListItem)
export type {ListItemProps}
