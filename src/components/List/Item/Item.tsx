import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {State} from '../../Common/interface';
import {Hovered} from '../../Hovered/Hovered';
import {TouchableRipple, TouchableRippleProps} from '../../TouchableRipple/TouchableRipple';
import {Container, Content, Headline, Leading, Main, SupportingText, Trailing} from './Item.styles';
import {ItemBase, RenderProps} from './ItemBase';

export type ListItemState = State | 'trailingHovered' | 'removed';
export interface ItemProps extends TouchableRippleProps {
    headline?: string;
    trailing?: React.JSX.Element;
    supportingText?: string;
    leading?: React.JSX.Element;
    active?: boolean;
    close?: boolean;
}

const AnimatedMain = Animated.createAnimatedComponent(Main);
const AnimatedContainer = Animated.createAnimatedComponent(Container);
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
            touchableRippleHeight,
            touchableRippleWidth,
            backgroundColor,
            trailingOpacity,
            height,
        } = renderStyle;

        return (
            <AnimatedContainer
                accessibilityLabel={headline}
                accessibilityRole="list"
                testID={`listItem--${id}`}
                style={{height}}>
                <TouchableRipple {...touchableRippleProps} ref={ref} underlayColor={underlayColor}>
                    <AnimatedMain
                        testID={`listItem__main--${id}`}
                        style={{backgroundColor}}
                        state={state}>
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
                    </AnimatedMain>

                    {typeof touchableRippleWidth === 'number' && (
                        <Hovered
                            height={touchableRippleHeight}
                            state={
                                ['trailingHovered', 'removed'].includes(state)
                                    ? 'enabled'
                                    : (state as State)
                            }
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
