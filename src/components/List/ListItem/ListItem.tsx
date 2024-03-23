import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {TouchableRipple} from '../../TouchableRipple/TouchableRipple';
import {Hovered} from '../../Underlay/Hovered';
import {
    AddonAfter,
    Container,
    Content,
    Headline,
    Inner,
    Leading,
    Main,
    MainInner,
    SupportingText,
    Trailing,
} from './ListItem.styles';
import {ListItemBase, ListItemProps, RenderProps} from './ListItemBase';

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedTrailing = Animated.createAnimatedComponent(Trailing);
const AnimatedMain = Animated.createAnimatedComponent(Main);
const render = ({
    active,
    activeColor,
    addonAfter,
    addonBefore,
    eventName,
    itemGap,
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
    onAddonAfterLayout,
    ...innerProps
}: RenderProps) => {
    const {onLayout, ...onTouchableRippleEvent} = onEvent;
    const {containerHeight, trailingOpacity, scaleX} = renderStyle;
    const addon = addonBefore || addonAfter;

    return (
        <AnimatedContainer
            accessibilityLabel={headline}
            accessibilityRole="list"
            style={{height: containerHeight}}
            testID={`listItem--${id}`}>
            <Inner {...(addon && {shape})} itemGap={itemGap} testID={`listItem__inner--${id}`}>
                <AnimatedMain testID={`listItem_main--${id}`} style={{transform: [{scaleX}]}}>
                    <TouchableRipple
                        {...(!addon && {shape})}
                        {...onTouchableRippleEvent}
                        active={active}
                        touchableLocation={touchableLocation}
                        underlayColor={activeColor}>
                        <MainInner
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
                                supportingTextShow={
                                    !!(typeof supporting === 'string' && supporting)
                                }
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

                                {supporting &&
                                    size !== 'small' &&
                                    typeof supporting === 'string' && (
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

                            <Hovered eventName={eventName} underlayColor={underlayColor} />
                        </MainInner>
                    </TouchableRipple>
                </AnimatedMain>

                {addonAfter && (
                    <AddonAfter
                        testID={`listItem__addonAfterInner--${id}`}
                        onLayout={onAddonAfterLayout}>
                        {addonAfter}
                    </AddonAfter>
                )}
            </Inner>
        </AnimatedContainer>
    );
};

const ForwardRefListItem = forwardRef<View, ListItemProps>((props, ref) => (
    <ListItemBase {...props} ref={ref} render={render} />
));

export const ListItem: FC<ListItemProps> = memo(ForwardRefListItem);
export type {ListItemProps};
