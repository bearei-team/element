import {FC, useId} from 'react';
import {Animated, ViewStyle} from 'react-native';
import {HoveredProps} from './Hovered';
import {useAnimated} from './useAnimated';

export interface RenderProps extends HoveredProps {
    renderStyle: Animated.WithAnimatedObject<ViewStyle>;
}
export interface BaseHoveredProps extends HoveredProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseHovered: FC<BaseHoveredProps> = ({
    height,
    render,
    state,
    width,
    ...renderProps
}) => {
    const {opacity} = useAnimated({state});
    const id = useId();

    return render({
        ...renderProps,
        id,
        renderStyle: {height, opacity, width},
    });
};
