import {FC, memo} from 'react';
import {BaseRipple, RenderProps} from './BaseRipple';
import {Container} from './Ripple.styles';
import {LayoutRectangle, NativeTouchEvent, ViewProps} from 'react-native';

export type RippleAnimatedOut = (finished: () => void) => number;
export interface RippleProps extends ViewProps {
    sequence?: string;
    centered?: boolean;
    underlayColor?: string;
    touchableLayout: LayoutRectangle;
    touchableEvent: NativeTouchEvent;
    onAnimatedEnd: (sequence: string, animatedOut: RippleAnimatedOut) => void;
}

export const Ripple: FC<RippleProps> = memo((props: RippleProps): React.JSX.Element => {
    const render = ({id, children, ...args}: RenderProps): React.JSX.Element => (
        <Container {...args} testID={`ripple--${id}`}>
            {children}
        </Container>
    );

    return <BaseRipple {...props} render={render} />;
});
