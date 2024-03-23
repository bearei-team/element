import {RefAttributes, forwardRef, useId} from 'react';
import {View, ViewProps, ViewStyle} from 'react-native';
import {AnimatedStyle} from 'react-native-reanimated';
import {ShapeProps} from '../Common/Common.styles';
import {EventName} from '../Common/interface';
import {useAnimated} from './useAnimated';

type BaseProps = Partial<Pick<ShapeProps, 'shape'> & ViewProps & RefAttributes<View>>;

export interface HoveredProps extends BaseProps {
    eventName?: EventName;
    opacities?: [number, number, number] | [number, number];
    renderStyle?: {width?: number; height?: number};
    underlayColor?: string;
}

export interface RenderProps extends HoveredProps {
    renderStyle: AnimatedStyle<ViewStyle> & {height?: number; width?: number};
}

interface HoveredBaseProps extends HoveredProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const HoveredBase = forwardRef<View, HoveredBaseProps>(
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
