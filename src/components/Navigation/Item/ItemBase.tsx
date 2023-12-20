import {FC, cloneElement, useCallback, useEffect, useId} from 'react';
import {
    Animated,
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    TextStyle,
    ViewStyle,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useImmer} from 'use-immer';
import {
    OnStateChangeOptions,
    useHandleEvent,
} from '../../../hooks/useHandleEvent';
import {AnimatedInterpolation, State} from '../../Common/interface';
import {Icon} from '../../Icon/Icon';
import {ItemProps} from './Item';
import {useAnimated} from './useAnimated';

export interface RenderProps extends ItemProps {
    pressPosition: number;
    onHeaderLayout: (event: LayoutChangeEvent) => void;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        headerHeight: number;
        headerWidth: number;
        iconBackgroundWidth: AnimatedInterpolation;
        iconBackgroundColor: AnimatedInterpolation;
        labelColor: AnimatedInterpolation;
        labelHeight: AnimatedInterpolation;
    };
    underlayColor: string;
    state: State;
}

export interface ItemBaseProps extends ItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const initialState = {
    layout: {} as LayoutRectangle,
    headerLayout: {} as LayoutRectangle,
    pressPosition: 0.5,
};

export const ItemBase: FC<ItemBaseProps> = props => {
    const {
        active = false,
        activeIcon = <Icon type="filled" category="image" name="circle" />,
        block = false,
        icon = <Icon type="outlined" category="image" name="circle" />,
        onLayout,
        render,
        ...renderProps
    } = props;

    const [{headerLayout, layout, pressPosition}, setState] =
        useImmer(initialState);

    const id = useId();
    const theme = useTheme();
    const {iconBackgroundColor, labelColor, iconBackgroundWidth, labelHeight} =
        useAnimated({
            active,
            block,
        });

    const underlayColor = active
        ? theme.palette.secondary.onSecondaryContainer
        : theme.palette.surface.onSurface;

    const processStateChange = useCallback(
        (nextState: State, options?: OnStateChangeOptions) => {
            if (nextState === 'pressIn') {
                const {event} = options ?? {};
                const {locationX} =
                    (event as GestureResponderEvent)?.nativeEvent ?? 0;

                const position = locationX / layout.width;

                setState(draft => {
                    draft.pressPosition = position;
                });
            }
        },
        [layout.width, setState],
    );

    const {state, ...handleEvent} = useHandleEvent({
        ...props,
        disabled: false,
        onStateChange: processStateChange,
    });

    const processLayout = (event: LayoutChangeEvent) => {
        const nativeEventLayout = event.nativeEvent.layout;

        setState(draft => {
            draft.layout = nativeEventLayout;
        });

        onLayout?.(event);
    };

    const processHeaderLayout = (event: LayoutChangeEvent) => {
        const nativeEventLayout = event.nativeEvent.layout;

        setState(draft => {
            draft.headerLayout = nativeEventLayout;
        });
    };

    useEffect(() => {
        !active &&
            setState(draft => {
                draft.pressPosition = 0.5;
            });
    }, [active, setState]);

    return render({
        ...renderProps,
        ...handleEvent,
        active,
        activeIcon: cloneElement(activeIcon, {state}),
        icon: cloneElement(icon, {state}),
        id,
        onHeaderLayout: processHeaderLayout,
        onLayout: processLayout,
        pressPosition,
        renderStyle: {
            headerHeight: headerLayout.height,
            headerWidth: headerLayout.width,
            iconBackgroundColor,
            iconBackgroundWidth,
            labelColor,
            labelHeight,
        },
        shape: 'large',
        state,
        underlayColor,
    });
};
