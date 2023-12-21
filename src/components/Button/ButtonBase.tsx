import {FC, useCallback, useEffect, useId} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    TextStyle,
    ViewStyle,
} from 'react-native';
import {useImmer} from 'use-immer';
import {useHandleEvent} from '../../hooks/useHandleEvent';
import {ShapeProps} from '../Common/Common.styles';
import {State} from '../Common/interface';
import {ElevationProps} from '../Elevation/Elevation';
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {ButtonProps} from './Button';

import {useAnimated} from './useAnimated';
import {useBorder} from './useBorder';
import {useIcon} from './useIcon';
import {useUnderlayColor} from './useUnderlayColor';

export interface RenderProps
    extends Partial<
        Pick<ShapeProps, 'shape'> & Omit<ButtonProps, 'elevation'>
    > {
    elevation: ElevationProps['level'];
    iconShow: boolean;
    labelTextShow?: boolean;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        touchableRippleHeight: number;
        touchableRippleWidth: number;
    };
    state: State;
    underlayColor: TouchableRippleProps['underlayColor'];
}

export interface ButtonBaseProps extends ButtonProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const initialState = {
    elevation: 0 as ElevationProps['level'],
    state: 'enabled' as State,
    touchableRippleLayout: {} as LayoutRectangle,
};

export const ButtonBase: FC<ButtonBaseProps> = props => {
    const {
        category = 'common',
        disabled = false,
        elevation: elevationStyle = true,
        fabType = 'primary',
        icon,
        labelText,
        onLayout,
        render,
        type = 'filled',
        ...renderProps
    } = props;

    const [{elevation, touchableRippleLayout}, setState] =
        useImmer(initialState);

    const [underlayColor] = useUnderlayColor({type, category, fabType});
    const id = useId();

    const processElevation = useCallback(
        (nextState: State) => {
            const level = {
                disabled: 0,
                enabled: 0,
                error: 0,
                focused: 0,
                hovered: 1,
                longPressIn: 0,
                pressIn: 0,
            };

            const nextElevation = type === 'elevated' ? 1 : 0;
            const correctionCoefficient =
                category === 'fab' ? 3 : nextElevation;

            category !== 'icon' &&
                elevationStyle &&
                setState(draft => {
                    draft.elevation = (level[nextState] +
                        correctionCoefficient) as ElevationProps['level'];
                });
        },
        [category, elevationStyle, setState, type],
    );

    const processStateChange = useCallback(
        (nextState: State) => {
            const elevationType = ['elevated', 'filled', 'tonal'].includes(
                type,
            );

            elevationType && processElevation(nextState);
        },
        [processElevation, type],
    );

    const {state, ...handleEvent} = useHandleEvent({
        ...props,
        disabled,
        onStateChange: processStateChange,
    });

    const iconElement = useIcon({
        category,
        disabled,
        fabType,
        icon,
        state,
        type,
    });

    const {backgroundColor, borderColor, color} = useAnimated({
        category,
        disabled,
        fabType,
        state,
        type,
    });

    const border = useBorder({borderColor});

    const processLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const nativeEventLayout = event.nativeEvent.layout;

            setState(draft => {
                draft.touchableRippleLayout = nativeEventLayout;
            });

            onLayout?.(event);
        },
        [onLayout, setState],
    );

    useEffect(() => {
        const commonElevation = disabled ? 0 : 1;
        const fabElevation = disabled ? 0 : 3;

        category === 'common' &&
            type === 'elevated' &&
            elevationStyle &&
            setState(draft => {
                draft.elevation = commonElevation;
            });

        category === 'fab' &&
            elevationStyle &&
            setState(draft => {
                draft.elevation = fabElevation;
            });
    }, [category, disabled, elevationStyle, setState, type]);

    return render({
        ...renderProps,
        ...handleEvent,
        category,
        disabled,
        elevation,
        icon: iconElement,
        iconShow: !!iconElement,
        id,
        labelText: labelText ?? (category === 'common' ? 'Label' : labelText),
        labelTextShow: !!labelText,
        onLayout: processLayout,
        renderStyle: {
            ...border,
            backgroundColor,
            color,
            touchableRippleHeight: touchableRippleLayout.height,
            touchableRippleWidth: touchableRippleLayout.width,
        },
        shape: category === 'fab' ? 'large' : 'full',
        state,
        type,
        underlayColor,
    });
};
