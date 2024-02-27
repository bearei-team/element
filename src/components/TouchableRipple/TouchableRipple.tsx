import {FC, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {Container, Content} from './TouchableRipple.styles';
import {RenderProps, TouchableRippleBase, TouchableRippleProps} from './TouchableRippleBase';

const render = ({id, children, shape, onEvent, ripples, ...containerProps}: RenderProps) => (
    <Container {...containerProps} {...onEvent} testID={`touchableRipple--${id}`}>
        <Content shape={shape} testID={`touchableRipple__content--${id}`}>
            {children}
            {ripples}
        </Content>
    </Container>
);

const ForwardRefTouchableRipple = forwardRef<View, TouchableRippleProps>((props, ref) => (
    <TouchableRippleBase {...props} render={render} ref={ref} />
));

export const TouchableRipple: FC<TouchableRippleProps> = memo(ForwardRefTouchableRipple);
export type {TouchableRippleProps};
