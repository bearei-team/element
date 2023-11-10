import {FC, ReactNode, RefAttributes, forwardRef, memo} from 'react';
import {PressableProps, View} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {Hovered} from '../Hovered/Hovered';
import {BaseTouchableRipple, RenderProps} from './BaseTouchableRipple';
import {RippleProps} from './Ripple/Ripple';
import {Container, Main} from './TouchableRipple.styles';

export interface TouchableRippleProps
    extends Omit<
        PressableProps & Pick<RippleProps, 'underlayColor' | 'centered'> & RefAttributes<View>,
        'children'
    > {
    children?: ReactNode;
    disabled?: boolean;
    shapeProps?: ShapeProps;
}

const ForwardRefTouchableRipple = forwardRef<View, TouchableRippleProps>((props, ref) => {
    const render = ({id, children, shapeProps, hoveredProps, ...containerProps}: RenderProps) => (
        <Container {...containerProps} ref={ref} testID={`touchableRipple--${id}`}>
            <Main {...shapeProps} testID={`touchableRipple__main--${id}`}>
                {children}
            </Main>

            {hoveredProps && <Hovered {...hoveredProps} />}
        </Container>
    );

    return <BaseTouchableRipple {...props} render={render} />;
});

export const TouchableRipple: FC<TouchableRippleProps> = memo(ForwardRefTouchableRipple);
