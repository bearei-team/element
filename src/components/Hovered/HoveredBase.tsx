import {FC, useId} from 'react';
import {Animated, ViewStyle} from 'react-native';
import {HoveredProps} from './Hovered';
import {useAnimated} from './useAnimated';

export interface RenderProps extends HoveredProps {
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        height?: number;
        width?: number;
    };
}
export interface HoveredBaseProps extends HoveredProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const HoveredBase: FC<HoveredBaseProps> = ({
    eventName,
    height,
    opacities,
    render,
    width,
    ...renderProps
}) => {
    const [{opacity}] = useAnimated({eventName, opacities});
    const id = useId();

    return render({
        ...renderProps,
        id,
        renderStyle: {height, opacity, width},
    });
};
