import {FC, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {Container, Content, Inner} from './TouchableRipple.styles';
import {RenderProps, TouchableRippleBase, TouchableRippleProps} from './TouchableRippleBase';

const render = ({id, children, shape, onEvent, ripples, ...containerProps}: RenderProps) => (
    <Container {...containerProps} shape={shape} testID={`touchableRipple--${id}`}>
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

export const TouchableRipple: FC<TouchableRippleProps> = memo(ForwardRefTouchableRipple);
export type {TouchableRippleProps};
