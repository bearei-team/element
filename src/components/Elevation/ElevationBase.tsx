import {FC, useId} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    ViewStyle,
} from 'react-native';
import {useImmer} from 'use-immer';
import {AnimatedInterpolation} from '../Common/interface';
import {ElevationProps} from './Elevation';
import {useAnimated} from './useAnimated';

export interface RenderProps extends ElevationProps {
    onContentLayout?: (event: LayoutChangeEvent) => void;
    renderStyle: Animated.WithAnimatedObject<
        ViewStyle & {
            opacity0?: AnimatedInterpolation;
            opacity1?: AnimatedInterpolation;
        }
    > & {
        contentHeight: number;
        contentWidth: number;
    };
}

export interface ElevationBaseProps extends ElevationProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const ElevationBase: FC<ElevationBaseProps> = props => {
    const {level = 0, render, ...renderProps} = props;
    const [contentLayout, setContentLayout] = useImmer({} as LayoutRectangle);
    const {shadow0Opacity, shadow1Opacity} = useAnimated({level});
    const id = useId();

    const processLayout = (event: LayoutChangeEvent) => {
        const nativeEventLayout = event.nativeEvent.layout;

        setContentLayout(() => layout);
    };

    return render({
        ...renderProps,
        id,
        level,
        onContentLayout: processLayout,
        renderStyle: {
            contentHeight: contentLayout.height,
            contentWidth: contentLayout.width,
            opacity0: shadow0Opacity,
            opacity1: shadow1Opacity,
        },
    });
};
