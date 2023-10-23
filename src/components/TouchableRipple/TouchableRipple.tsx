import {Container} from './TouchableRipple.styles';
import {FC, ReactNode, memo} from 'react';
import {BaseTouchableRipple, RenderProps} from './BaseTouchableRipple';
import {PressableProps} from 'react-native';
import {RippleProps} from './Ripple/Ripple';

export interface TouchableRippleProps
    extends Omit<PressableProps & Pick<RippleProps, 'underlayColor' | 'centered'>, 'children'> {
    children?: ReactNode;
}

export const TouchableRipple: FC<TouchableRippleProps> = memo((props): React.JSX.Element => {
    const render = ({id, children, ...args}: RenderProps): React.JSX.Element => (
        <Container {...args} testID={`touchableRipple--${id}`}>
            {children}
        </Container>
    );

    return <BaseTouchableRipple {...props} render={render} />;
});
