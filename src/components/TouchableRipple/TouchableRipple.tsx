import {Container} from './TouchableRipple.styles';
import {FC, ReactNode, memo} from 'react';
import {BaseTouchableRipple, RenderProps} from './BaseTouchableRipple';
import {PressableProps} from 'react-native';
import {RippleProps} from './Ripple/Ripple';
import {Hovered} from '../Hovered/Hovered';

export interface TouchableRippleProps
    extends Omit<PressableProps & Pick<RippleProps, 'underlayColor' | 'centered'>, 'children'> {
    children?: ReactNode;
    disabled?: boolean;
}

export const TouchableRipple: FC<TouchableRippleProps> = memo((props): React.JSX.Element => {
    const render = ({id, children, hoveredProps, ...args}: RenderProps): React.JSX.Element => (
        <Container {...args} testID={`touchableRipple--${id}`}>
            {children}
            <Hovered {...hoveredProps} />
        </Container>
    );

    return <BaseTouchableRipple {...props} render={render} />;
});
