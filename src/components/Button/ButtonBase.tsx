import {FC, cloneElement, useCallback, useEffect, useId} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextStyle, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useImmer} from 'use-immer';
import {useHandleEvent} from '../../hooks/useHandleEvent';
import {ShapeProps} from '../Common/Common.styles';
import {State} from '../Common/interface';
import {ElevationProps} from '../Elevation/Elevation';
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {ButtonProps} from './Button';
import {useAnimated} from './useAnimated';
import {useUnderlayColor} from './useUnderlayColor';

export interface RenderProps extends Partial<Pick<ShapeProps, 'shape'> & ButtonProps> {
    elevation: ElevationProps['level'];
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        touchableRippleHeight: number;
        touchableRippleWidth: number;
    };
    iconShow: boolean;
    state: State;
    underlayColor: TouchableRippleProps['underlayColor'];
    labelTextShow?: boolean;
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
        category = 'common',
        disabled = false,
        icon,
        onLayout,
        render,
        type = 'filled',
        fabType = 'primary',
        labelText,
        ...renderProps
    } = props;

    const [{elevation, touchableRippleLayout}, setState] = useImmer(initialState);
    const [underlayColor] = useUnderlayColor({type, category, fabType});
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
                pressIn: 0,
                longPressIn: 0,
            };

            category !== 'icon' &&
                setState(draft => {
                    const nextElevation = type === 'elevated' ? 1 : 0;
                    const correctionCoefficient = category === 'fab' ? 3 : nextElevation;

                    draft.elevation = (level[nextState] +
                        correctionCoefficient) as ElevationProps['level'];
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
        disabled,
        onStateChange: processStateChange,
    });

    const {backgroundColor, borderColor, color} = useAnimated({
        category,
        disabled,
        fabType,
        state,
        type,
    });

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
        const commonFillType = {
            filled: theme.palette.primary.onPrimary,
            outlined: theme.palette.surface.onSurfaceVariant,
            tonal: theme.palette.surface.onSurfaceVariant,
        };

        const fabFillType = {
            primary: theme.palette.primary.onPrimaryContainer,
            secondary: theme.palette.secondary.onSecondaryContainer,
            surface: theme.palette.primary.primary,
            tertiary: theme.palette.tertiary.onTertiaryContainer,
        };

        const fill =
            category === 'fab'
                ? fabFillType[fabType]
                : commonFillType[type as keyof typeof commonFillType];

        if (category === 'common' || !icon) {
            return icon;
        }

        return cloneElement(icon, {
            state,
            fill: disabled ? theme.color.rgba(theme.palette.surface.onSurface, 0.38) : fill,
        });
    };

    useEffect(() => {
        category === 'common' &&
            type === 'elevated' &&
            setState(draft => {
                draft.elevation = disabled ? 0 : 1;
            });

        category === 'fab' &&
            setState(draft => {
                draft.elevation = disabled ? 0 : 3;
            });
    }, [category, disabled, setState, type]);

    return render({
        ...renderProps,
        ...handleEvent,
        category,
        disabled,
        elevation,
        icon: processIcon(),
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
        iconShow: !!icon,
        state,
        type,
        underlayColor,
    });
};
