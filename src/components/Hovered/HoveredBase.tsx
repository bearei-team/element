import {FC, RefAttributes, useId} from 'react';
import {Animated, View, ViewProps, ViewStyle} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {EventName} from '../Common/interface';
import {useAnimated} from './useAnimated';

export interface HoveredProps
    extends Partial<
        ViewProps & RefAttributes<Animated.LegacyRef<View>> & Pick<ShapeProps, 'shape'>
    > {
    eventName?: EventName;
    opacities?: [number, number, number] | [number, number];
    renderStyle?: {width?: number; height?: number};
    underlayColor?: string;
}

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
    opacities,
    render,
    renderStyle,
    ...renderProps
}) => {
    const [{opacity}] = useAnimated({eventName, opacities});
    const id = useId();

    return render({
        ...renderProps,
        id,
        renderStyle: {...renderStyle, opacity},
    });
};
