import {Container, Main} from './TouchableRipple.styles';
import {FC, ReactNode} from 'react';
import {RenderContainerProps, RenderMainProps, BaseTouchableRipple} from './BaseTouchableRipple';
import {PressableProps} from 'react-native';
import {RippleProps} from './Ripple/Ripple';

export interface TouchableRippleProps
    extends Omit<PressableProps & Pick<RippleProps, 'underlayColor' | 'centered'>, 'children'> {
    children?: ReactNode;
}

export const TouchableRipple: FC<TouchableRippleProps> = (props): React.JSX.Element => {
    const renderContainer = ({
        id,
        children,
        ...containerProps
    }: RenderContainerProps): React.JSX.Element => (
        <Container {...containerProps} testID={`touchableRipple__container--${id}`}>
            {children}
        </Container>
    );

    const renderMain = ({id, children}: RenderMainProps): React.JSX.Element => (
        <Main testID={`touchableRipple__main--${id}`}>{children}</Main>
    );

    return (
        <BaseTouchableRipple {...props} renderMain={renderMain} renderContainer={renderContainer} />
    );
};
