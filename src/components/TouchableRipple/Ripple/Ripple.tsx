import {FC, memo} from 'react';
import {BaseRipple, BaseRippleProps, RenderContainerProps, RenderMainProps} from './BaseRipple';
import {Container, Main} from './Ripple.styles';

export interface RippleProps extends BaseRippleProps {}
export const Ripple: FC<RippleProps> = memo((props: RippleProps): React.JSX.Element => {
    const renderContainer = ({
        id,
        children,
        x,
        y,
        underlayColor,
        isRTL,
        ...args
    }: RenderContainerProps): React.JSX.Element => (
        <Container
            {...args}
            testID={`ripple__container--${id}`}
            x={x}
            y={y}
            isRTL={isRTL}
            underlayColor={underlayColor}>
            {children}
        </Container>
    );

    const renderMain = ({id, children, ...args}: RenderMainProps): React.JSX.Element => (
        <Main {...args} testID={`ripple__main--${id}`}>
            {children}
        </Main>
    );

    return <BaseRipple {...props} renderMain={renderMain} renderContainer={renderContainer} />;
});
