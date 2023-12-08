import {FC, cloneElement, useCallback, useEffect, useId} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextStyle, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useImmer} from 'use-immer';
import {useHandleEvent} from '../../hooks/useHandleEvent';
import {State} from '../Common/interface';
import {ElevationProps} from '../Elevation/Elevation';
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {ButtonProps} from './Button';
import {useAnimated} from './useAnimated';
import {useUnderlayColor} from './useUnderlayColor';

export interface RenderProps extends ButtonProps {
    elevation: ElevationProps['level'];
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        touchableRippleHeight: number;
        touchableRippleWidth: number;
    };
    iconShow: boolean;
    state: State;
    underlayColor: TouchableRippleProps['underlayColor'];
}

export interface ButtonBaseProps extends ButtonProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const initialState = {
    elevation: 0 as ElevationProps['level'],
    state: 'enabled' as State,
    touchableRippleLayout: {} as Pick<LayoutRectangle, 'height' | 'width'>,
};

export const ButtonBase: FC<ButtonBaseProps> = props => {
    const {
        category = 'button',
        disabled = false,
        icon,
        onLayout,
        render,
        type = 'filled',
        ...renderProps
    } = props;

    const [{elevation, touchableRippleLayout}, setState] = useImmer(initialState);
    const [underlayColor] = useUnderlayColor({type, category});
    const id = useId();
    const theme = useTheme();

    const processElevation = useCallback(
        (nextState: State) => {
            const level = {
                disabled: 0,
                enabled: 0,
                error: 0,
                focused: 0,
                hovered: 1,
                pressed: 0,
                pressIn: 0,
                longPressIn: 0,
            };

            category !== 'iconButton' &&
                setState(draft => {
                    draft.elevation = (
                        type === 'elevated' ? level[nextState] + 1 : level[nextState]
                    ) as ElevationProps['level'];
                });
        },
        [category, setState, type],
    );

    const processStateChange = useCallback(
        (nextState: State) => {
            const elevationType = ['elevated', 'filled', 'tonal'].includes(type);

            elevationType && processElevation(nextState);
        },
        [processElevation, type],
    );

    const {state, ...handleEvent} = useHandleEvent({
        ...props,
        onStateChange: processStateChange,
    });

    const {backgroundColor, borderColor, color} = useAnimated({type, disabled, state});
    const border = borderColor && {
        borderColor,
        borderStyle: 'solid' as ViewStyle['borderStyle'],
        borderWidth: theme.adaptSize(1),
    };

    const processLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const {height, width} = event.nativeEvent.layout;

            setState(draft => {
                draft.touchableRippleLayout = {height, width};
            });

            onLayout?.(event);
        },
        [onLayout, setState],
    );

    const processIcon = () => {
        const fillType = {
            filled: theme.palette.primary.onPrimary,
            outlined: theme.palette.surface.onSurfaceVariant,
            tonal: theme.palette.surface.onSurfaceVariant,
        };

        return category === 'button' || !icon
            ? icon
            : cloneElement(icon, {
                  state,
                  fill: disabled
                      ? theme.color.rgba(theme.palette.surface.onSurface, 0.38)
                      : fillType[type as keyof typeof fillType],
              });
    };

    useEffect(() => {
        type === 'elevated' &&
            category === 'button' &&
            setState(draft => {
                draft.elevation = disabled ? 0 : 1;
            });
    }, [category, disabled, setState, type]);

    return render({
        ...handleEvent,
        ...renderProps,
        category,
        disabled,
        elevation,
        icon: processIcon(),
        id,
        onLayout: processLayout,
        renderStyle: {
            ...border,
            backgroundColor,
            color,
            touchableRippleHeight: touchableRippleLayout.height,
            touchableRippleWidth: touchableRippleLayout.width,
        },
        shape: 'full',
        iconShow: !!icon,
        state,
        type,
        underlayColor,
    });
};
