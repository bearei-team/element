import {Container, Main} from './TouchableRipple.styles';
import {FC, ReactNode, memo} from 'react';
import {BaseTouchableRipple, RenderProps} from './BaseTouchableRipple';
import {PressableProps} from 'react-native';
import {RippleProps} from './Ripple/Ripple';
import {ShapeProps} from '../Common/Shape.styles';
// import {Hovered} from '../Hovered/Hovered';

export interface TouchableRippleProps
    extends Omit<PressableProps & Pick<RippleProps, 'underlayColor' | 'centered'>, 'children'> {
    children?: ReactNode;
    disabled?: boolean;
    shapeProps?: ShapeProps;
}

export const TouchableRipple: FC<TouchableRippleProps> = memo((props): React.JSX.Element => {
    const render = ({id, children, shapeProps, ...args}: RenderProps): React.JSX.Element => (
        <Container {...args} testID={`touchableRipple--${id}`}>
            <Main {...shapeProps} testID={`touchableRipple__main--${id}`}>
                {children}
            </Main>
        </Container>
    );

    return <BaseTouchableRipple {...props} render={render} />;
});
