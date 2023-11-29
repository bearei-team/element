import {FC, useId} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, ViewStyle} from 'react-native';
import {useImmer} from 'use-immer';
import {AnimatedInterpolation} from '../Common/interface';
import {ElevationProps} from './Elevation';
import {useAnimated} from './useAnimated';

export interface RenderProps extends ElevationProps {
    renderStyle: Animated.WithAnimatedObject<
        ViewStyle & {
            opacity0?: AnimatedInterpolation;
            opacity1?: AnimatedInterpolation;
        }
    >;
}

export interface ElevationBaseProps extends ElevationProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const ElevationBase: FC<ElevationBaseProps> = ({
    level = 0,
    onLayout,
    render,
    ...renderProps
}) => {
    const [layout, setLayout] = useImmer({} as Pick<LayoutRectangle, 'height' | 'width'>);
    const {shadow0Opacity, shadow1Opacity} = useAnimated({level});
    const id = useId();

    const processLayout = (event: LayoutChangeEvent) => {
        const {height, width} = event.nativeEvent.layout;

        setLayout(() => ({height, width}));
        onLayout?.(event);
    };

    return render({
        ...renderProps,
        id,
        level,
        onLayout: processLayout,
        renderStyle: {
            height: layout.height,
            opacity0: shadow0Opacity,
            opacity1: shadow1Opacity,
            width: layout.width,
        },
    });
};
