import {FC, memo} from 'react';
import {BaseRipple, RenderContainerProps, RenderMainProps} from './BaseRipple';
import {Container, Main} from './Ripple.styles';
import {LayoutRectangle, NativeTouchEvent, ViewProps} from 'react-native';

export type RippleAnimationOut = (finished: () => void) => number;
export interface RippleProps extends ViewProps {
    sequence?: string;
    centered?: boolean;
    underlayColor?: string;
    touchableLayout: LayoutRectangle;
    touchableEvent: NativeTouchEvent;
    onAnimationEnd: (sequence: string, animatedOut: RippleAnimationOut) => void;
}

export const Ripple: FC<RippleProps> = memo((props: RippleProps): React.JSX.Element => {
    const renderContainer = ({
        id,
        children,
        x,
        y,

        isRTL,
        ...args
    }: RenderContainerProps): React.JSX.Element => (
        <Container {...args} testID={`ripple__container--${id}`} x={x} y={y} isRTL={isRTL}>
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
