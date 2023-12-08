import {FC, ReactNode, RefAttributes, forwardRef, memo} from 'react';
import {PressableProps, View} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {RippleProps} from './Ripple/Ripple';
import {Container, Content} from './TouchableRipple.styles';
import {RenderProps, TouchableRippleBase} from './TouchableRippleBase';

export type TouchableProps = PressableProps &
    Pick<RippleProps, 'underlayColor' | 'centered'> &
    RefAttributes<View> &
    Pick<ShapeProps, 'shape'>;

export interface TouchableRippleProps extends Omit<TouchableProps, 'children'> {
    children?: ReactNode;
    disabled?: boolean;
}

const ForwardRefTouchableRipple = forwardRef<View, TouchableRippleProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, children, shape, ...containerProps} = renderProps;

        return (
            <Container {...containerProps} ref={ref} testID={`touchableRipple--${id}`}>
                <Content shape={shape} testID={`touchableRipple__content--${id}`}>
                    {children}
                </Content>
            </Container>
        );
    };

    return <TouchableRippleBase {...props} render={render} />;
});

export const TouchableRipple: FC<TouchableRippleProps> = memo(ForwardRefTouchableRipple);
