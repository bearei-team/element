import {FC, forwardRef, memo} from 'react'
import {View} from 'react-native'
import Animated from 'react-native-reanimated'
import {TouchableRipple} from '../../TouchableRipple/TouchableRipple'
import {Underlay} from '../../Underlay/Underlay'
import {
    AddonAfter,
    AddonBefore,
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
    addonAfter,
    addonBefore,
    eventName,
    headline,
    id,
    itemGap,
    leading,
    onAddonAfterLayout,
    onEvent,
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
    const {onLayout, ...onTouchableRippleEvent} = onEvent
    const {containerAnimatedStyle, mainAnimatedStyle, trailingAnimatedStyle} =
        renderStyle

    const addon = addonBefore || addonAfter

    return (
        <AnimatedContainer
            accessibilityLabel={headline}
            accessibilityRole='list'
            style={[containerAnimatedStyle]}
            testID={`listItem--${id}`}
        >
            <AnimatedInner
                {...(addon && {shape})}
                itemGap={itemGap}
                onLayout={onLayout}
                testID={`listItem__inner--${id}`}
                style={[mainAnimatedStyle]}
            >
                {addonBefore && (
                    <AddonBefore
                        onLayout={onAddonAfterLayout}
                        testID={`listItem__before--${id}`}
                    >
                        {addonBefore}
                    </AddonBefore>
                )}

                <Main testID={`listItem_main--${id}`}>
                    <TouchableRipple
                        {...(!addon && {shape})}
                        {...onTouchableRippleEvent}
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

                {addonAfter && (
                    <AddonAfter
                        onLayout={onAddonAfterLayout}
                        testID={`listItem__addonAfter--${id}`}
                    >
                        {addonAfter}
                    </AddonAfter>
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
