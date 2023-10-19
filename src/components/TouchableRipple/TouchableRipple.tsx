import {Container, Main} from './TouchableRipple.styles';
import {FC} from 'react';
import {
    TouchableRippleProps,
    RenderContainerProps,
    RenderMainProps,
    BaseTouchableRipple,
} from './BaseTouchableRipple';

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
