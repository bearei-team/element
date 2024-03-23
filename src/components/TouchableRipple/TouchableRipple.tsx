import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Container, Content, Inner} from './TouchableRipple.styles';
import {RenderProps, TouchableRippleBase, TouchableRippleProps} from './TouchableRippleBase';

const render = ({id, children, onEvent, ripples, ...containerProps}: RenderProps) => (
    <Container {...containerProps} testID={`touchableRipple--${id}`}>
        <Content {...onEvent} testID={`touchableRipple__content--${id}`}>
            <Inner testID={`touchableRipple__inner--${id}`}>
                {children}
                {ripples}
            </Inner>
        </Content>
    </Container>
);

const ForwardRefTouchableRipple = forwardRef<View, TouchableRippleProps>((props, ref) => (
    <TouchableRippleBase {...props} render={render} ref={ref} />
));

export const TouchableRipple = memo(ForwardRefTouchableRipple) as Animated.AnimatedComponent<
    FC<TouchableRippleProps>
>;

export type {TouchableRippleProps};
