import {FC, useCallback, useEffect, useId} from 'react';
import {
    Animated,
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    MouseEvent,
    NativeSyntheticEvent,
    TargetedEvent,
    TextStyle,
    ViewStyle,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useImmer} from 'use-immer';
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
}

export interface ItemBaseProps extends ItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const initialState = {
    headerLayout: {} as Pick<LayoutRectangle, 'height' | 'width'>,
    state: 'enabled' as State,
    pressPosition: 0.5,
};

export const ItemBase: FC<ItemBaseProps> = props => {
    const {
        active = false,
        onBlur,
        onFocus,
        onHoverIn,
        onHoverOut,
        onPressIn,
        onPressOut,
        render,
        icon = <Icon type="outlined" category="image" name="circle" />,
        activeIcon = <Icon type="filled" category="image" name="circle" />,
        ...renderProps
    } = props;

    const [{headerLayout, state, pressPosition}, setState] = useImmer(initialState);
    const id = useId();
    const theme = useTheme();
    const {iconBackgroundColor, labelColor, iconBackgroundWidth, labelHeight} = useAnimated({
        active,
    });

    const underlayColor = active
        ? theme.palette.surface.onSurface
        : theme.palette.secondary.onSecondaryContainer;

    const mobile = ['ios', 'android'].includes(theme.OS);
    const processState = useCallback(
        (nextState: State, callback?: () => void) => {
            setState(draft => {
                draft.state = nextState;
            });

            callback?.();
        },
        [setState],
    );

    const processHeaderLayout = (event: LayoutChangeEvent) => {
        const {height, width} = event.nativeEvent.layout;

        setState(draft => {
            draft.headerLayout = {height, width};
        });
    };

    const handleHoverIn = useCallback(
        (event: MouseEvent) => processState('hovered', () => onHoverIn?.(event)),
        [onHoverIn, processState],
    );

    const handleHoverOut = useCallback(
        (event: MouseEvent) => processState('enabled', () => onHoverOut?.(event)),
        [onHoverOut, processState],
    );

    const handleFocus = useCallback(
        (event: NativeSyntheticEvent<TargetedEvent>) =>
            processState('focused', () => onFocus?.(event)),
        [onFocus, processState],
    );

    const handleBlur = useCallback(
        (event: NativeSyntheticEvent<TargetedEvent>) =>
            processState('enabled', () => onBlur?.(event)),
        [onBlur, processState],
    );

    const handlePressIn = useCallback(
        (event: GestureResponderEvent) => {
            const {locationX} = event.nativeEvent;
            const position = locationX / headerLayout.width;

            !mobile &&
                setState(draft => {
                    draft.pressPosition = position;
                });

            processState('pressed', () => onPressIn?.(event));
        },
        [headerLayout.width, mobile, onPressIn, processState, setState],
    );

    const handlePressOut = useCallback(
        (event: GestureResponderEvent) => {
            processState(mobile ? 'enabled' : 'hovered', () => onPressOut?.(event));
        },
        [mobile, onPressOut, processState],
    );

    useEffect(() => {
        !active &&
            setState(draft => {
                draft.pressPosition = 0.5;
            });
    }, [active, setState]);

    return render({
        ...renderProps,
        active,
        activeIcon,
        icon,
        id,
        pressPosition,
        onBlur: handleBlur,
        onFocus: handleFocus,
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
        onHeaderLayout: processHeaderLayout,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        renderStyle: {
            iconBackgroundColor,
            iconBackgroundWidth,
            headerHeight: headerLayout.height,
            headerWidth: headerLayout.width,
            labelColor,
            labelHeight,
        },
        shape: 'full',
        state,
        underlayColor,
    });
};
