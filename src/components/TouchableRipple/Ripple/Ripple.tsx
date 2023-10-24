import {FC, memo} from 'react';
import {BaseRipple, RenderProps} from './BaseRipple';
import {Container} from './Ripple.styles';
import {LayoutRectangle, NativeTouchEvent, ViewProps} from 'react-native';
import {Animated} from 'react-native';

export type RippleAnimatedOut = (finished: () => void) => number;
export interface RippleProps extends ViewProps {
    sequence?: string;
    centered?: boolean;
    underlayColor?: string;
    touchableLayout: Pick<LayoutRectangle, 'width' | 'height'>;
    location: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    onAnimatedEnd: (sequence: string, animatedOut: RippleAnimatedOut) => void;
}

export const Ripple: FC<RippleProps> = memo((props: RippleProps) => {
    const render = ({id, children, ...animatedContainerProps}: RenderProps) => {
        const AnimatedContainer = Animated.createAnimatedComponent(Container);

        return (
            <AnimatedContainer {...animatedContainerProps} testID={`ripple--${id}`} shape="full">
                {children}
            </AnimatedContainer>
        );
    };

    return <BaseRipple {...props} render={render} />;
});
