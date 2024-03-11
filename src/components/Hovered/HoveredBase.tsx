import {RefAttributes, forwardRef, useId} from 'react';
import {Animated, View, ViewProps, ViewStyle} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {EventName} from '../Common/interface';
import {useAnimated} from './useAnimated';

type BaseProps = Partial<
    Pick<ShapeProps, 'shape'> & ViewProps & RefAttributes<Animated.LegacyRef<View>>
>;

export interface HoveredProps extends BaseProps {
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

interface HoveredBaseProps extends HoveredProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const HoveredBase = forwardRef<Animated.LegacyRef<View>, HoveredBaseProps>(
    ({eventName, opacities, render, renderStyle, ...renderProps}, ref) => {
        const [{opacity}] = useAnimated({eventName, opacities});
        const id = useId();

        return render({
            ...renderProps,
            id,
            ref,
            renderStyle: {...renderStyle, opacity},
        });
    },
);
