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
    headline?: string;
    leading?: React.JSX.Element;
    supportingText?: string;
    supportingTextNumberOfLines?: number;
    trailing?: React.JSX.Element;
    indexKey?: string;
    onClose?: (key?: string) => void;
}

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedInner = Animated.createAnimatedComponent(Inner);
const AnimatedTrailing = Animated.createAnimatedComponent(Trailing);
const ForwardRefListItem = forwardRef<View, ListItemProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            eventName,
            headline,
            id,
            leading,
            onEvent,
            ref: containerRef,
            renderStyle,
            style,
            supportingText,
            supportingTextNumberOfLines,
            trailing,
            underlayColor,
            activeColor,
            active,
            activeLocation,
            defaultActive,
            visible,
            ...containerProps
        } = renderProps;

        const {onLayout, ...onTouchableRippleEvent} = onEvent;
        const {trailingOpacity, width, height, transform} = renderStyle;

        return (
            <AnimatedContainer
                {...containerProps}
                accessibilityLabel={headline}
                accessibilityRole="list"
                onLayout={onLayout}
                ref={containerRef}
                style={{
                    ...(typeof style === 'object' && style),
                    ...{transform},
                }}
                testID={`listItem--${id}`}
                visible={visible}>
                <TouchableRipple
                    {...onTouchableRippleEvent}
                    active={active}
                    activeLocation={activeLocation}
                    defaultActive={defaultActive}
                    underlayColor={activeColor}>
                    <AnimatedInner>
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
