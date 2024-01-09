import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Hovered} from '../../Hovered/Hovered';
import {
    TouchableRipple,
    TouchableRippleProps,
} from '../../TouchableRipple/TouchableRipple';
import {
    Container,
    Content,
    Headline,
    Inner,
    Leading,
    SupportingText,
    Trailing,
} from './ListItem.styles';
import {ListItemBase, RenderProps} from './ListItemBase';

export interface ListItemProps extends TouchableRippleProps {
    active?: boolean;
    close?: boolean;
    defaultActive?: boolean;
    headline?: string;
    indexKey?: string;
    leading?: React.JSX.Element;
    onClose?: (key?: string) => void;
    supportingText?: string;
    supportingTextNumberOfLines?: number;
    trailing?: React.JSX.Element;
}

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedInner = Animated.createAnimatedComponent(Inner);
const AnimatedTrailing = Animated.createAnimatedComponent(Trailing);
const ForwardRefListItem = forwardRef<View, ListItemProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            active,
            activeColor,
            activeLocation,
            defaultActive,
            eventName,
            headline,
            id,
            leading,
            onEvent,
            renderStyle,
            style,
            supportingText,
            supportingTextNumberOfLines,
            trailing,
            underlayColor,
            ...containerProps
        } = renderProps;

        const {onLayout, ...onTouchableRippleEvent} = onEvent;
        const {trailingOpacity, width, height, minHeight} = renderStyle;

        return (
            <AnimatedContainer
                {...containerProps}
                accessibilityLabel={headline}
                accessibilityRole="list"
                style={{
                    ...(typeof style === 'object' && style),
                    ...{height: minHeight},
                }}
                testID={`listItem--${id}`}>
                <TouchableRipple
                    {...onTouchableRippleEvent}
                    active={active}
                    activeLocation={activeLocation}
                    defaultActive={defaultActive}
                    underlayColor={activeColor}>
                    <AnimatedInner onLayout={onLayout}>
                        {leading && (
                            <Leading testID={`listItem__leading--${id}`}>
                                {leading}
                            </Leading>
                        )}

                        <Content
                            supportingTextShow={!!supportingText}
                            testID={`listItem__content--${id}`}>
                            <Headline
                                ellipsizeMode="tail"
                                numberOfLines={1}
                                size="large"
                                testID={`listItem__headline--${id}`}
                                type="body">
                                {headline}
                            </Headline>

                            {supportingText && (
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
                            <AnimatedTrailing
                                style={{opacity: trailingOpacity}}
                                testID={`listItem__trailing--${id}`}>
                                {trailing}
                            </AnimatedTrailing>
                        )}

                        <Hovered
                            eventName={eventName}
                            height={height}
                            underlayColor={underlayColor}
                            width={width}
                        />
                    </AnimatedInner>
                </TouchableRipple>
            </AnimatedContainer>
        );
    };

    return <ListItemBase {...props} ref={ref} render={render} />;
});

export const ListItem: FC<ListItemProps> = memo(ForwardRefListItem);
