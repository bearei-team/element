import {FC, useId} from 'react';
import {Animated, LayoutChangeEvent} from 'react-native';
import {useImmer} from 'use-immer';
import {ElevationProps} from './Elevation';
import {useAnimated} from './useAnimated';

export interface RenderProps extends ElevationProps {
    width: number;
    height: number;
    opacity0: Animated.AnimatedInterpolation<string | number>;
    opacity1: Animated.AnimatedInterpolation<string | number>;
}

export interface BaseElevationProps extends ElevationProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseElevation: FC<BaseElevationProps> = ({
    level = 0,
    render,
    onLayout,
    ...renderProps
}) => {
    const id = useId();
    const [layout, setLayout] = useImmer({} as Pick<RenderProps, 'width' | 'height'>);
    const {shadow0Opacity, shadow1Opacity} = useAnimated({level});
    const processLayout = (event: LayoutChangeEvent) => {
        const {width, height} = event.nativeEvent.layout;

        setLayout(() => ({width, height}));
        onLayout?.(event);
    };

    return render({
        ...renderProps,
        height: layout.height,
        id,
        level,
        onLayout: processLayout,
        opacity0: shadow0Opacity,
        opacity1: shadow1Opacity,
        width: layout.width,
    });
};
