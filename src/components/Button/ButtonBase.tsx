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
        contentHeight: number;
        contentWidth: number;
        height: number;
        width: number;
    };
    onContentLayout: (event: LayoutChangeEvent) => void;
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

const processShape = (options: Pick<RenderProps, 'category' | 'type'>) => {
    const {category, type} = options;
    const categoryShape = category === 'fab' ? 'large' : 'full';

    return type === 'link' ? 'none' : categoryShape;
};

const initialState = {
    checked: false,
    contentLayout: {} as LayoutRectangle,
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
        indeterminate = false,
        labelText,
        onCheckedChange,
        onLayout,
        render,
        type = 'filled',
        ...renderProps
    } = props;

    const checkButton = ['radio', 'checkbox'].includes(category);
    const buttonType = checkButton ? 'text' : type;
    const id = useId();
    const [
        {checked: buttonChecked, elevation, layout, contentLayout},
        setState,
    ] = useImmer(initialState);

    const [underlayColor] = useUnderlayColor({
        type: buttonType,
        category,
        fabType,
    });

    const processChecked = useCallback(() => {
        setState(draft => {
            const nextChecked = !draft.checked;

            draft.checked = nextChecked;

            onCheckedChange?.(nextChecked);
        });
    }, [onCheckedChange, setState]);

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
        checkButton,
        checked: buttonChecked,
        disabled,
        fabType,
        icon,
        indeterminate,
        state,
        type: buttonType,
    });

    const {backgroundColor, borderColor, color} = useAnimated({
        category,
        disabled,
        fabType,
        state,
        type: buttonType,
    });

    const border = useBorder({borderColor, type});
    const processLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const nativeEventLayout = event.nativeEvent.layout;

            block &&
                setState(draft => {
                    draft.layout = nativeEventLayout;
                });

            onLayout?.(event);
        },
        [block, onLayout, setState],
    );

    const processContentLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const nativeEventLayout = event.nativeEvent.layout;

            !block &&
                setState(draft => {
                    draft.contentLayout = nativeEventLayout;
                });

            onLayout?.(event);
        },
        [block, onLayout, setState],
    );

    useEffect(() => {
        const commonElevation = disabled ? 0 : 1;
        const fabElevation = disabled ? 0 : 3;
        const setCommonElevation = checkSetCommonElevation({
            category,
            elevation: elevationStyle,
            type: buttonType,
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
        checked !== buttonChecked &&
            setState(draft => {
                draft.checked = checked;
            });
    }, [buttonChecked, checked, setState]);

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
        onContentLayout: processContentLayout,
        onLayout: processLayout,
        renderStyle: {
            ...border,
            backgroundColor,
            color,
            contentHeight: contentLayout.height,
            contentWidth: contentLayout.width,
            height: layout.height,
            width: layout.width,
        },
        shape: processShape({category, type}),
        state,
        type: buttonType,
        underlayColor,
    });
};
