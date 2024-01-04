import {FC, useId} from 'react';
import {Animated, LayoutChangeEvent, ViewStyle} from 'react-native';
import {HOOK} from '../../hooks/hook';
import {OnEvent} from '../../hooks/useOnEvent';
import {AnimatedInterpolation} from '../Common/interface';
import {ElevationProps} from './Elevation';
import {useAnimated} from './useAnimated';

export interface RenderProps extends ElevationProps {
    onContentLayout?: (event: LayoutChangeEvent) => void;
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<
        ViewStyle & {
            opacity0?: AnimatedInterpolation;
            opacity1?: AnimatedInterpolation;
        }
    > & {
        height: number;
        width: number;
    };
}

export interface ElevationBaseProps extends ElevationProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const ElevationBase: FC<ElevationBaseProps> = props => {
    const {level = 0, render, ...renderProps} = props;
    const {shadow0Opacity, shadow1Opacity} = useAnimated({level});
    const id = useId();
    const {layout, ...onEvent} = HOOK.useOnEvent({
        ...props,
    });

    return render({
        ...renderProps,
        id,
        level,
        onEvent,
        renderStyle: {
            height: layout.height,
            width: layout.width,
            opacity0: shadow0Opacity,
            opacity1: shadow1Opacity,
        },
    });
};
