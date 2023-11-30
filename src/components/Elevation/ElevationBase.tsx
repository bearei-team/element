import {FC, useId} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, ViewStyle} from 'react-native';
import {useImmer} from 'use-immer';
import {AnimatedInterpolation} from '../Common/interface';
import {ElevationProps} from './Elevation';
import {useAnimated} from './useAnimated';

export interface RenderProps extends ElevationProps {
    onMainLayout?: (event: LayoutChangeEvent) => void;
    renderStyle: Animated.WithAnimatedObject<
        ViewStyle & {
            opacity0?: AnimatedInterpolation;
            opacity1?: AnimatedInterpolation;
        }
    > & {
        mainHeight: number;
        mainWidth: number;
    };
}

export interface ElevationBaseProps extends ElevationProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const ElevationBase: FC<ElevationBaseProps> = props => {
    const {level = 0, render, ...renderProps} = props;
    const [mainLayout, setMainLayout] = useImmer({} as Pick<LayoutRectangle, 'height' | 'width'>);
    const {shadow0Opacity, shadow1Opacity} = useAnimated({level});
    const id = useId();

    const processLayout = (event: LayoutChangeEvent) => {
        const {height, width} = event.nativeEvent.layout;

        setMainLayout(() => ({height, width}));
    };

    return render({
        ...renderProps,
        id,
        level,
        onMainLayout: processLayout,
        renderStyle: {
            mainHeight: mainLayout.height,
            opacity0: shadow0Opacity,
            opacity1: shadow1Opacity,
            mainWidth: mainLayout.width,
        },
    });
};
