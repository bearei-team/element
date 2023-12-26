import {FC, useCallback, useEffect, useId} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    TextStyle,
    ViewStyle,
} from 'react-native';
import {useImmer} from 'use-immer';
import {OnStateChangeOptions, useHandleEvent} from '../../hooks/useHandleEvent';
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
        height: number;
        width: number;
    };
    state: State;
    underlayColor: TouchableRippleProps['underlayColor'];
}

export interface ButtonBaseProps extends ButtonProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const checkSetCommonElevation = (
    options: Pick<ButtonProps, 'category' | 'type' | 'elevation'>,
) => {
    const {category, type, elevation} = options;

    return category === 'common' && type === 'elevated' && elevation;
};

const checkSetFabElevation = (options: Omit<ButtonProps, 'type'>) => {
    const {category, elevation} = options;

    return category === 'fab' && elevation;
};

const processCorrectionCoefficient = (
    options: Pick<RenderProps, 'category' | 'type'>,
) => {
    const {category, type} = options;
    const nextElevation = type === 'elevated' ? 1 : 0;

    return category === 'fab' ? 3 : nextElevation;
};

const processDefaultLabelText = (
    options: Pick<RenderProps, 'labelText' | 'category'>,
) => {
    const {labelText, category} = options;

    return labelText ?? (category === 'common' ? 'Label' : labelText);
};

const processShape = (options: Pick<RenderProps, 'category'>) => {
    const {category} = options;

    return category === 'fab' ? 'large' : 'full';
};

const initialState = {
    checked: false,
    elevation: 0 as ElevationProps['level'],
    layout: {} as LayoutRectangle,
    state: 'enabled' as State,
};

export const ButtonBase: FC<ButtonBaseProps> = props => {
    const {
        block = false,
        category = 'common',
        checked = false,
        disabled = false,
        elevation: elevationStyle = true,
        fabType = 'primary',
        icon,
        labelText,
        onCheckedChange,
        onLayout,
        render,
        type = 'filled',
        ...renderProps
    } = props;

    const buttonType = category === 'radio' ? 'text' : type;
    const id = useId();
    const [{checked: radioChecked, elevation, layout}, setState] =
        useImmer(initialState);

    const [underlayColor] = useUnderlayColor({
        type: buttonType,
        category,
        fabType,
    });

    const processChecked = useCallback(() => {
        if (category === 'radio') {
            setState(draft => {
                const nextChecked = !draft.checked;

                draft.checked = nextChecked;

                onCheckedChange?.(nextChecked);
            });
        }
    }, [category, onCheckedChange, setState]);

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

            const correctionCoefficient = processCorrectionCoefficient({
                type: buttonType,
                category,
            });

            category !== 'icon' &&
                elevationStyle &&
                setState(draft => {
                    draft.elevation = (level[nextState] +
                        correctionCoefficient) as ElevationProps['level'];
                });
        },
        [buttonType, category, elevationStyle, setState],
    );

    const processStateChange = useCallback(
        (nextState: State, options = {} as OnStateChangeOptions) => {
            const {eventName} = options;
            const elevationType = ['elevated', 'filled', 'tonal'].includes(
                buttonType,
            );

            elevationType && processElevation(nextState);
            eventName === 'pressOut' && processChecked();
        },
        [buttonType, processChecked, processElevation],
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
        type: buttonType,
        checked: radioChecked,
    });

    const {backgroundColor, borderColor, color} = useAnimated({
        category,
        disabled,
        fabType,
        state,
        type: buttonType,
    });

    const border = useBorder({borderColor});
    const processLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const nativeEventLayout = event.nativeEvent.layout;

            setState(draft => {
                draft.layout = nativeEventLayout;
            });

            onLayout?.(event);
        },
        [onLayout, setState],
    );

    useEffect(() => {
        const commonElevation = disabled ? 0 : 1;
        const fabElevation = disabled ? 0 : 3;
        const setCommonElevation = checkSetCommonElevation({
            category,
            type: buttonType,
            elevation: elevationStyle,
        });

        if (setCommonElevation) {
            return setState(draft => {
                draft.elevation = commonElevation;
            });
        }

        checkSetFabElevation({category, elevation: elevationStyle}) &&
            setState(draft => {
                draft.elevation = fabElevation;
            });
    }, [buttonType, category, disabled, elevationStyle, setState]);

    useEffect(() => {
        setState(draft => {
            draft.checked = checked;
        });
    }, [checked, setState]);

    return render({
        ...renderProps,
        ...handleEvent,
        block,
        category,
        disabled,
        elevation,
        icon: iconElement,
        iconShow: !!iconElement,
        id,
        labelText: processDefaultLabelText({labelText, category}),
        labelTextShow: !!labelText,
        onLayout: processLayout,
        renderStyle: {
            ...border,
            backgroundColor,
            color,
            height: layout.height,
            width: layout.width,
        },
        shape: processShape({category}),
        state,
        type: buttonType,
        underlayColor,
    });
};
