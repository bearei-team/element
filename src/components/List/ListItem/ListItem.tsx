import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Hovered} from '../../Hovered/Hovered';
import {TouchableRipple} from '../../TouchableRipple/TouchableRipple';
import {
    Bc,
    Container,
    Content,
    Headline,
    Inner,
    Leading,
    SupportingText,
    Trailing,
    TrailingInner,
} from './ListItem.styles';
import {ListItemBase, ListItemProps, RenderProps} from './ListItemBase';

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedTrailingInner = Animated.createAnimatedComponent(TrailingInner);
const render = ({
    active,
    activeColor,
    touchableLocation,
    eventName,
    gap,
    headline,
    id,
    leading,
    onEvent,
    renderStyle,
    shape,
    supportingText,
    supportingTextNumberOfLines,
    trailing,
    underlayColor,
    size,
    ...innerProps
}: RenderProps) => {
    const {onLayout, ...onTouchableRippleEvent} = onEvent;
    const {containerHeight, height, trailingOpacity, width} = renderStyle;

    return (
        <AnimatedContainer
            accessibilityLabel={headline}
            accessibilityRole="list"
            gap={gap}
            style={{height: containerHeight}}
            testID={`listItem--${id}`}>
            <Bc shape={shape}>
                <TouchableRipple
                    {...onTouchableRippleEvent}
                    active={active}
                    shape={shape}
                    touchableLocation={touchableLocation}
                    underlayColor={activeColor}>
                    <Inner
                        {...innerProps}
                        size={size}
                        onLayout={onLayout}
                        testID={`listItem__inner--${id}`}>
                        {leading && (
                            <Leading size={size} testID={`listItem__leading--${id}`}>
                                {leading}
                            </Leading>
                        )}

                        <Content
                            size={size}
                            supportingTextShow={!!supportingText}
                            testID={`listItem__content--${id}`}>
                            <Headline
                                ellipsizeMode="tail"
                                numberOfLines={1}
                                size={size === 'small' ? 'medium' : 'large'}
                                testID={`listItem__headline--${id}`}
                                type={size === 'small' ? 'label' : 'body'}>
                                {headline}
                            </Headline>

                            {supportingText && size !== 'small' && (
                                <SupportingText
                                    ellipsizeMode="tail"
                                    numberOfLines={supportingTextNumberOfLines}
                                    size="medium"
                                    testID={`listItem__supportingText--${id}`}
                                    type="body">
                                    {supportingText}
                                </SupportingText>
                            )}
                        </Content>

                        {trailing && (
                            <Trailing testID={`listItem__trailing--${id}`}>
                                <AnimatedTrailingInner
                                    size={size}
                                    style={{opacity: trailingOpacity}}
                                    testID={`listItem__trailingInner--${id}`}>
                                    {trailing}
                                </AnimatedTrailingInner>
                            </Trailing>
                        )}

                        <Hovered
                            eventName={eventName}
                            renderStyle={{width, height}}
                            shape={shape}
                            underlayColor={underlayColor}
                        />
                    </Inner>
                </TouchableRipple>
            </Bc>
        </AnimatedContainer>
    );
};

const ForwardRefListItem = forwardRef<View, ListItemProps>((props, ref) => (
    <ListItemBase {...props} ref={ref} render={render} />
));

export const ListItem: FC<ListItemProps> = memo(ForwardRefListItem);
export type {ListItemProps};
