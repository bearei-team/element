import {FC, RefAttributes, forwardRef, memo} from 'react';
import {NativeTouchEvent, PressableProps, View, ViewProps} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {RippleProps} from './Ripple/Ripple';
import {Container, Content} from './TouchableRipple.styles';
import {RenderProps, TouchableRippleBase} from './TouchableRippleBase';

export type TouchableProps = PressableProps &
    Pick<RippleProps, 'underlayColor' | 'centered' | 'active' | 'defaultActive'> &
    RefAttributes<View> &
    ViewProps &
    Pick<ShapeProps, 'shape'>;

export interface TouchableRippleProps
    extends Omit<TouchableProps, 'children' | 'disabled' | 'hitSlop'> {
    activeLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    children?: React.JSX.Element;
    disabled?: boolean;
    onRippleAnimatedEnd?: () => void;
}

const ForwardRefTouchableRipple = forwardRef<View, TouchableRippleProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, children, shape, onEvent, ...pressableProps} = renderProps;

        return (
            <Container {...pressableProps} {...onEvent} testID={`touchableRipple--${id}`}>
                <Content shape={shape} testID={`touchableRipple__content--${id}`}>
                    {children}
                </Content>
            </Container>
        );
    };

    return <TouchableRippleBase {...props} render={render} ref={ref} />;
});

export const TouchableRipple: FC<TouchableRippleProps> = memo(ForwardRefTouchableRipple);
