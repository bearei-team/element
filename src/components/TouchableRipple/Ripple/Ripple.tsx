import {FC, memo} from 'react';
import {BaseRipple, RenderProps} from './BaseRipple';
import {Container} from './Ripple.styles';
import {LayoutRectangle, NativeTouchEvent, View, ViewProps} from 'react-native';
import {Animated} from 'react-native';

export type RippleAnimatedOut = (finished: () => void) => number;
export interface RippleProps extends Animated.AnimatedProps<ViewProps & React.RefAttributes<View>> {
    sequence?: string;
    centered?: boolean;
    underlayColor?: string;
    touchableLayout: Pick<LayoutRectangle, 'width' | 'height'>;
    location: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    onAnimatedEnd: (sequence: string, animatedOut: RippleAnimatedOut) => void;
}

export const Ripple: FC<RippleProps> = memo((props: RippleProps) => {
    const AnimatedContainer = Animated.createAnimatedComponent(Container);
    const render = ({id, ...containerProps}: RenderProps) => (
        <AnimatedContainer {...containerProps} testID={`ripple--${id}`} shape="full" />
    );

    return <BaseRipple {...props} render={render} />;
});
