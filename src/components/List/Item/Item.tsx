import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Hovered} from '../../Hovered/Hovered';
import {TouchableRipple, TouchableRippleProps} from '../../TouchableRipple/TouchableRipple';
import {
    Container,
    Content,
    Headline,
    Inner,
    Leading,
    SupportingText,
    Trailing,
} from './Item.styles';
import {ItemBase, RenderProps} from './ItemBase';

export interface ItemProps extends TouchableRippleProps {
    headline?: string;
    trailing?: React.JSX.Element;
    supportingText?: string;
    leading?: React.JSX.Element;
    active?: boolean;
    close?: boolean;
}

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedInner = Animated.createAnimatedComponent(Inner);
const AnimatedTrailing = Animated.createAnimatedComponent(Trailing);
const ForwardRefItem = forwardRef<View, ItemProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            headline,
            id,
            leading,
            renderStyle,
            state,
            supportingText,
            trailing,
            underlayColor,
            ...touchableRippleProps
        } = renderProps;

        const {
            backgroundColor,
            height,
            touchableRippleHeight,
            touchableRippleWidth,
            trailingOpacity,
        } = renderStyle;

        return (
            <AnimatedContainer
                accessibilityLabel={headline}
                accessibilityRole="list"
                style={{height}}
                testID={`listItem--${id}`}>
                <TouchableRipple {...touchableRippleProps} ref={ref} underlayColor={underlayColor}>
                    <AnimatedInner testID={`listItem__inner--${id}`} style={{backgroundColor}}>
                        {leading && (
                            <Leading testID={`listItem__leading--${id}`}>{leading}</Leading>
                        )}

                        <Content>
                            <Headline testID={`listItem__headline--${id}`}>{headline}</Headline>
                            {supportingText && (
                                <SupportingText testID={`listItem__supportingText--${id}`}>
                                    {supportingText}
                                </SupportingText>
                            )}
                        </Content>

                        {trailing && (
                            <AnimatedTrailing
                                testID={`listItem__trailing--${id}`}
                                style={{opacity: trailingOpacity}}>
                                {trailing}
                            </AnimatedTrailing>
                        )}
                    </AnimatedInner>

                    {typeof touchableRippleWidth === 'number' && (
                        <Hovered
                            height={touchableRippleHeight}
                            state={state}
                            underlayColor={underlayColor}
                            width={touchableRippleWidth}
                        />
                    )}
                </TouchableRipple>
            </AnimatedContainer>
        );
    };

    return <ItemBase {...props} render={render} />;
});

export const Item: FC<ItemProps> = memo(ForwardRefItem);
