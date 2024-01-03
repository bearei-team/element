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
}

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedInner = Animated.createAnimatedComponent(Inner);
const AnimatedTrailing = Animated.createAnimatedComponent(Trailing);
const ForwardRefListItem = forwardRef<View, ListItemProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            active,
            activeColor,
            eventName,
            headline,
            id,
            leading,
            onLayout,
            renderStyle,
            style,
            supportingText,
            supportingTextNumberOfLines,
            supportingTextShow,
            trailing,
            underlayColor,
            activeEvent,
            ...touchableRippleProps
        } = renderProps;

        const {
            height,
            touchableRippleHeight,
            touchableRippleWidth,
            trailingOpacity,
        } = renderStyle;

        console.info(headline);

        return (
            <TouchableRipple
                {...touchableRippleProps}
                active={active}
                activeEvent={activeEvent}
                activeRipple={true}
                disabled={active}
                ref={ref}
                underlayColor={activeColor}>
                <AnimatedContainer
                    accessibilityLabel={headline}
                    accessibilityRole="list"
                    style={{height}}
                    testID={`listItem--${id}`}>
                    <AnimatedInner
                        onLayout={onLayout}
                        style={{
                            ...(typeof style === 'object' && style),
                        }}
                        testID={`listItem__inner--${id}`}>
                        {leading && (
                            <Leading testID={`listItem__leading--${id}`}>
                                {leading}
                            </Leading>
                        )}

                        <Content
                            supportingTextShow={supportingTextShow}
                            testID={`listItem__content--${id}`}>
                            <Headline
                                ellipsizeMode="tail"
                                numberOfLines={1}
                                testID={`listItem__headline--${id}`}>
                                {headline}
                            </Headline>

                            {supportingText && (
                                <SupportingText
                                    {...(typeof supportingTextNumberOfLines ===
                                        'number' && {
                                        ellipsizeMode: 'tail',
                                        numberOfLines:
                                            supportingTextNumberOfLines,
                                    })}
                                    testID={`listItem__supportingText--${id}`}>
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
                    </AnimatedInner>
                </AnimatedContainer>

                {typeof touchableRippleWidth === 'number' && (
                    <Hovered
                        height={touchableRippleHeight}
                        eventName={eventName}
                        underlayColor={underlayColor}
                        width={touchableRippleWidth}
                    />
                )}
            </TouchableRipple>
        );
    };

    return <ListItemBase {...props} render={render} />;
});

export const ListItem: FC<ListItemProps> = memo(ForwardRefListItem);
