import {FC, useId} from 'react';
import {Animated, NativeTouchEvent, ViewStyle} from 'react-native';
import {RippleProps} from './Ripple';
import {useAnimated} from './useAnimated';
export interface RenderProps extends RippleProps {
    renderStyle: Animated.WithAnimatedObject<
        ViewStyle & {height: number; width: number}
    >;

    x: number;
    y: number;
}

export interface RippleBaseProps extends RippleProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const RippleBase: FC<RippleBaseProps> = props => {
    const {
        active,
        centered = false,
        defaultActive,
        location = {} as Pick<NativeTouchEvent, 'locationX' | 'locationY'>,
        onEntryAnimatedEnd,
        render,
        sequence,
        touchableLayout,
        underlayColor,
        ...renderProps
    } = props;

    const {width = 0, height = 0} = touchableLayout ?? {};
    const centerX = width / 2;
    const centerY = height / 2;
    const id = useId();
    const {locationX = 0, locationY = 0} =
        centered || defaultActive
            ? {locationX: centerX, locationY: centerY}
            : location;

    const offsetX = Math.abs(centerX - locationX);
    const offsetY = Math.abs(centerY - locationY);
    const radius = Math.sqrt(
        Math.pow(centerX + offsetX, 2) + Math.pow(centerY + offsetY, 2),
    );

    const diameter = radius * 2;
    const {opacity, scale} = useAnimated({
        active,
        defaultActive,
        minDuration: diameter,
        onEntryAnimatedEnd,
        sequence,
    });

    return render({
        ...renderProps,
        active,
        defaultActive,
        id,
        renderStyle: {
            height: diameter,
            opacity,
            transform: [{translateY: -radius}, {translateX: -radius}, {scale}],
            width: diameter,
        },

        underlayColor,
        x: locationX,
        y: locationY,
    });
};
