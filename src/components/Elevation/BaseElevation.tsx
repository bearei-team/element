import {FC, useId} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, ViewStyle} from 'react-native';
import {useImmer} from 'use-immer';
import {ElevationProps} from './Elevation';
import {useAnimated} from './useAnimated';

export interface RenderProps extends ElevationProps {
    renderStyle: Animated.WithAnimatedObject<
        ViewStyle & {
            opacity0?: Animated.AnimatedInterpolation<string | number>;
            opacity1?: Animated.AnimatedInterpolation<string | number>;
        }
    >;
}

export interface BaseElevationProps extends ElevationProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseElevation: FC<BaseElevationProps> = ({
    level = 0,
    onLayout,
    render,
    ...renderProps
}) => {
    const id = useId();
    const [layout, setLayout] = useImmer({} as Pick<LayoutRectangle, 'height' | 'width'>);
    const {shadow0Opacity, shadow1Opacity} = useAnimated({level});
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
