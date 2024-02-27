import {FC, useId} from 'react';
import {
    Animated,
    LayoutRectangle,
    NativeTouchEvent,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';
import {useAnimated} from './useAnimated';

export interface RippleProps extends Partial<ViewProps & React.RefAttributes<View>> {
    active?: boolean;
    centered?: boolean;
    location?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    onEntryAnimatedEnd?: (sequence: string, exitAnimated: (finished?: () => void) => void) => void;
    sequence: string;
    touchableLayout?: LayoutRectangle;
    underlayColor?: string;
}

export interface RenderProps extends Omit<RippleProps, 'sequence'> {
    locationX: number;
    locationY: number;
    renderStyle: Animated.WithAnimatedObject<ViewStyle & {height: number; width: number}>;
}

interface RippleBaseProps extends RippleProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const RippleBase: FC<RippleBaseProps> = ({
    active,
    centered,
    location = {} as Pick<NativeTouchEvent, 'locationX' | 'locationY'>,
    onEntryAnimatedEnd,
    render,
    sequence,
    touchableLayout,
    underlayColor,
    ...renderProps
}) => {
    const {width = 0, height = 0} = touchableLayout ?? {};
    const centerX = width / 2;
    const centerY = height / 2;
    const id = useId();
    const {locationX = 0, locationY = 0} = centered
        ? {locationX: centerX, locationY: centerY}
        : location;

    const offsetX = Math.abs(centerX - locationX);
    const offsetY = Math.abs(centerY - locationY);
    const radius = Math.sqrt(Math.pow(centerX + offsetX, 2) + Math.pow(centerY + offsetY, 2));
    const diameter = radius * 2;
    const [{opacity, scale}] = useAnimated({
        active,
        minDuration: diameter,
        onEntryAnimatedEnd,
        sequence,
    });

    return render({
        ...renderProps,
        active,
        id,
        renderStyle: {
            height: diameter,
            opacity,
            transform: [{translateY: -radius}, {translateX: -radius}, {scale}],
            width: diameter,
        },
        locationX,
        locationY,
        underlayColor,
    });
};
