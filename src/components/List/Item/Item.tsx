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
            style,
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
            <TouchableRipple
                {...touchableRippleProps}
                accessibilityLabel={headline}
                accessibilityRole="list"
                ref={ref}
                underlayColor={underlayColor}>
                <AnimatedContainer style={{height}} testID={`listItem--${id}`}>
                    <AnimatedInner
                        style={{...(typeof style === 'object' && style), backgroundColor}}
                        testID={`listItem__inner--${id}`}>
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
                        state={state}
                        underlayColor={underlayColor}
                        width={touchableRippleWidth}
                    />
                )}
            </TouchableRipple>
        );
    };

    return <ItemBase {...props} render={render} />;
});

export const Item: FC<ItemProps> = memo(ForwardRefItem);
