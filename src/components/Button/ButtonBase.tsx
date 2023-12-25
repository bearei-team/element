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

export type SetElevationOptions = Pick<
    ButtonProps,
    'category' | 'type' | 'elevation'
>;

const initialState = {
    elevation: 0 as ElevationProps['level'],
    state: 'enabled' as State,
    layout: {} as LayoutRectangle,
    checked: false,
};

const checkSetCommonElevation = (options: SetElevationOptions) => {
    const {category, type, elevation} = options;

    return category === 'common' && type === 'elevated' && elevation;
};

const checkSetFabElevation = (options: Omit<SetElevationOptions, 'type'>) => {
    const {category, elevation} = options;

    return category === 'fab' && elevation;
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

export const ButtonBase: FC<ButtonBaseProps> = props => {
    const {
        category = 'common',
        disabled = false,
        elevation: elevationStyle = true,
        fabType = 'primary',
        block = false,
        icon,
        labelText,
        onLayout,
        render,
        type = 'filled',
        ...renderProps
    } = props;

    const [{elevation, layout, checked}, setState] = useImmer(initialState);
    const buttonType = category === 'radio' ? 'text' : type;
    const [underlayColor] = useUnderlayColor({
        type: buttonType,
        category,
        fabType,
    });

    const id = useId();
    const processChecked = useCallback(() => {
        category === 'radio' &&
            setState(draft => {
                draft.checked = !draft.checked;
            });
    }, [category, setState]);

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

            const nextElevation = buttonType === 'elevated' ? 1 : 0;
            const correctionCoefficient =
                category === 'fab' ? 3 : nextElevation;

            category !== 'icon' &&
                elevationStyle &&
                setState(draft => {
                    draft.elevation = (level[nextState] +
                        correctionCoefficient) as ElevationProps['level'];
                });
        },
        [category, elevationStyle, setState, buttonType],
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
        checked,
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

        checkSetCommonElevation({
            category,
            type: buttonType,
            elevation: elevationStyle,
        }) &&
            setState(draft => {
                draft.elevation = commonElevation;
            });

        checkSetFabElevation({category, elevation: elevationStyle}) &&
            setState(draft => {
                draft.elevation = fabElevation;
            });
    }, [category, disabled, elevationStyle, setState, buttonType]);

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
