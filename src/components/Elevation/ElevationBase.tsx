import {RefAttributes, forwardRef, useId} from 'react';
import {View, ViewProps, ViewStyle} from 'react-native';
import {AnimatedStyle} from 'react-native-reanimated';
import {ShapeProps} from '../Common/Common.styles';
import {useAnimated} from './useAnimated';

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5 | undefined;
export interface ElevationProps
    extends Partial<ViewProps & RefAttributes<View> & Pick<ShapeProps, 'shape'>> {
    block?: boolean;
    defaultLevel?: ElevationLevel;
    level?: ElevationLevel;
    renderStyle?: {height?: number; width?: number};
}

export interface RenderProps extends Omit<ElevationProps, 'renderStyle'> {
    renderStyle: AnimatedStyle<ViewStyle> & {
        height?: number;
        opacity0?: number;
        opacity1?: number;
        width?: number;
    };
}

interface ElevationBaseProps extends ElevationProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const ElevationBase = forwardRef<View, ElevationBaseProps>(
    ({defaultLevel, level: levelSource, render, renderStyle, ...renderProps}, ref) => {
        const id = useId();
        const level = levelSource ?? defaultLevel;
        const [{shadow0Opacity, shadow1Opacity}] = useAnimated({level});

        return render({
            ...renderProps,
            id,
            level,
            ref,
            renderStyle: {...renderStyle, opacity0: shadow0Opacity, opacity1: shadow1Opacity},
        });
    },
);
