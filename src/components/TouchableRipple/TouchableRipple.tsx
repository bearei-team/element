import {FC, RefAttributes, forwardRef, memo} from 'react';
import {GestureResponderEvent, PressableProps, View} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {RippleProps} from './Ripple/Ripple';
import {Container, Content} from './TouchableRipple.styles';
import {RenderProps, TouchableRippleBase} from './TouchableRippleBase';

export type TouchableProps = PressableProps &
    Pick<RippleProps, 'underlayColor' | 'centered'> &
    RefAttributes<View> &
    Pick<ShapeProps, 'shape'>;

export interface TouchableRippleProps extends Omit<TouchableProps, 'children'> {
    active?: boolean;
    activeEvent?: GestureResponderEvent;
    children?: React.JSX.Element;
    onRippleAnimatedEnd?: () => void;
}

const ForwardRefTouchableRipple = forwardRef<View, TouchableRippleProps>(
    (props, ref) => {
        const render = (renderProps: RenderProps) => {
            const {id, children, shape, onEvent, ...pressableProps} =
                renderProps;

            return (
                <Container
                    {...pressableProps}
                    {...onEvent}
                    ref={ref}
                    testID={`touchableRipple--${id}`}>
                    <Content
                        shape={shape}
                        testID={`touchableRipple__content--${id}`}>
                        {children}
                    </Content>
                </Container>
            );
        };

        return <TouchableRippleBase {...props} render={render} />;
    },
);

export const TouchableRipple: FC<TouchableRippleProps> = memo(
    ForwardRefTouchableRipple,
);
