import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Hovered} from '../../Hovered/Hovered';
import {TouchableRipple} from '../../TouchableRipple/TouchableRipple';
import {
    AddonAfter,
    AddonBefore,
    Background,
    Container,
    Content,
    Headline,
    Inner,
    Leading,
    SupportingText,
    Trailing,
} from './ListItem.styles';
import {ListItemBase, ListItemProps, RenderProps} from './ListItemBase';

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedTrailing = Animated.createAnimatedComponent(Trailing);
const AnimatedAddonBefore = Animated.createAnimatedComponent(AddonBefore);
const AnimatedAddonAfter = Animated.createAnimatedComponent(AddonAfter);
const render = ({
    active,
    activeColor,
    addonAfter,
    addonBefore,
    eventName,
    gap,
    headline,
    id,
    leading,
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
    const {onLayout, ...onTouchableRippleEvent} = onEvent;
    const {containerHeight, height, trailingOpacity, width, addonAfterWidth, addonBeforeWidth} =
        renderStyle;

    return (
        <AnimatedContainer
            accessibilityLabel={headline}
            accessibilityRole="list"
            gap={gap}
            style={{height: containerHeight}}
            testID={`listItem--${id}`}>
            {addonBefore && (
                <AnimatedAddonBefore
                    shape={shape}
                    testID={`listItem__addonBefore--${id}`}
                    style={{width: addonBeforeWidth}}>
                    {addonBefore}
                </AnimatedAddonBefore>
            )}

            <Background shape={shape} testID={`listItem__background--${id}`}>
                <TouchableRipple
                    {...onTouchableRippleEvent}
                    active={active}
                    shape={shape}
                    touchableLocation={touchableLocation}
                    underlayColor={activeColor}>
                    <Inner
                        {...innerProps}
                        size={size}
                        testID={`listItem__inner--${id}`}
                        onLayout={onLayout}>
                        {leading && (
                            <Leading size={size} testID={`listItem__leading--${id}`}>
                                {leading}
                            </Leading>
                        )}

                        <Content
                            size={size}
                            supportingTextShow={!!(typeof supporting === 'string' && supporting)}
                            testID={`listItem__content--${id}`}>
                            {size === 'small' ? (
                                <SupportingText
                                    ellipsizeMode="tail"
                                    numberOfLines={1}
                                    size="medium"
                                    testID={`listItem__supportingText--${id}`}
                                    type="body">
                                    {headline}
                                </SupportingText>
                            ) : (
                                <Headline
                                    ellipsizeMode="tail"
                                    numberOfLines={1}
                                    size="large"
                                    testID={`listItem__headline--${id}`}
                                    type="body">
                                    {headline}
                                </Headline>
                            )}

                            {supporting && size !== 'small' && typeof supporting === 'string' && (
                                <SupportingText
                                    ellipsizeMode="tail"
                                    numberOfLines={supportingTextNumberOfLines}
                                    size="medium"
                                    testID={`listItem__supportingText--${id}`}
                                    type="body">
                                    {supporting}
                                </SupportingText>
                            )}

                            {supporting && typeof supporting !== 'string' && supporting}
                        </Content>

                        {trailing && (
                            <AnimatedTrailing
                                size={size}
                                style={{opacity: trailingOpacity}}
                                testID={`listItem__trailingInner--${id}`}>
                                {trailing}
                            </AnimatedTrailing>
                        )}

                        <Hovered
                            eventName={eventName}
                            renderStyle={{width, height}}
                            shape={shape}
                            underlayColor={underlayColor}
                        />
                    </Inner>
                </TouchableRipple>
            </Background>

            {addonAfter && (
                <AnimatedAddonAfter
                    shape={shape}
                    testID={`listItem__addonAfter--${id}`}
                    style={{width: addonAfterWidth}}>
                    {addonAfter}
                </AnimatedAddonAfter>
            )}
        </AnimatedContainer>
    );
};

const ForwardRefListItem = forwardRef<View, ListItemProps>((props, ref) => (
    <ListItemBase {...props} ref={ref} render={render} />
));

export const ListItem: FC<ListItemProps> = memo(ForwardRefListItem);
export type {ListItemProps};
