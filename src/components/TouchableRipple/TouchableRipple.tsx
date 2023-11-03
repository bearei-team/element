import {Container, Main} from './TouchableRipple.styles';
import {FC, ReactNode, forwardRef, memo} from 'react';
import {BaseTouchableRipple, RenderProps} from './BaseTouchableRipple';
import {PressableProps, View} from 'react-native';
import {RippleProps} from './Ripple/Ripple';
import {ShapeProps} from '../Common/Shape.styles';
import {Hovered} from '../Hovered/Hovered';

export interface TouchableRippleProps
    extends Omit<PressableProps & Pick<RippleProps, 'underlayColor' | 'centered'>, 'children'> {
    children?: ReactNode;
    disabled?: boolean;
    shapeProps?: ShapeProps;
    ref?: React.Ref<View>;
}

export const TouchableRipple: FC<TouchableRippleProps> = memo(
    forwardRef<View, TouchableRippleProps>((props, ref) => {
        const render = ({
            id,
            children,
            shapeProps,
            hoveredProps,
            ...containerProps
        }: RenderProps) => (
            <Container {...containerProps} ref={ref} testID={`touchableRipple--${id}`}>
                <Main {...shapeProps} testID={`touchableRipple__main--${id}`}>
                    {children}
                </Main>

                {hoveredProps && <Hovered {...hoveredProps} />}
            </Container>
        );

        return <BaseTouchableRipple {...props} render={render} />;
    }),
);
