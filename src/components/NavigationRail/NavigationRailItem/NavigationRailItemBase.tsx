import {FC, RefAttributes, cloneElement, useCallback, useId, useMemo} from 'react';
import {
    Animated,
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    NativeTouchEvent,
    PressableProps,
    TextStyle,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../../hooks/useOnEvent';
import {ShapeProps} from '../../Common/Common.styles';
import {AnimatedInterpolation, EventName, State} from '../../Common/interface';
import {Icon, IconProps} from '../../Icon/Icon';
import {useAnimated} from './useAnimated';

export type NavigationRailType = 'segment' | 'block';
export interface NavigationRailItemProps
    extends Partial<ViewProps & RefAttributes<View> & Pick<ShapeProps, 'shape'> & PressableProps> {
    activeIcon?: React.JSX.Element;
    activeKey?: string;
    dataKey?: string;
    icon?: React.JSX.Element;
    labelText?: string;
    onActive?: (key?: string) => void;
    type?: NavigationRailType;
}

export interface RenderProps extends NavigationRailItemProps {
    active?: boolean;
    activeColor: string;
    eventName: EventName;
    onEvent: OnEvent;
    touchableLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height: number;
        labelHeight: AnimatedInterpolation;
        width: number;
    };
    underlayColor: string;
}

interface NavigationRailItemBaseProps extends NavigationRailItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface InitialState {
    eventName: EventName;
    layout: LayoutRectangle;
    touchableLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessPressOutOptions = Pick<RenderProps, 'activeKey' | 'dataKey' | 'onActive'> &
    ProcessEventOptions;

type ProcessStateChangeOptions = OnStateChangeOptions & ProcessPressOutOptions;

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        const update =
            draft.layout.width !== nativeEventLayout.width ||
            draft.layout.height !== nativeEventLayout.height;

        update && (draft.layout = nativeEventLayout);
    });
};

const processPressOut = (
    event: GestureResponderEvent,
    {dataKey, activeKey, onActive, setState}: ProcessPressOutOptions,
) => {
    if (activeKey === dataKey) {
        return;
    }

    const {locationX, locationY} = event.nativeEvent;

    setState(draft => {
        draft.touchableLocation = {locationX, locationY};
    });

    onActive?.(dataKey);
};

const processStateChange = ({
    event,
    eventName,
    setState,
    activeKey,
    dataKey,
    onActive,
}: ProcessStateChangeOptions) => {
    const nextEvent = {
        layout: () => processLayout(event as LayoutChangeEvent, {setState}),
        pressOut: () =>
            processPressOut(event as GestureResponderEvent, {
                activeKey,
                dataKey,
                onActive,
                setState,
            }),
    } as Record<EventName, () => void>;

    nextEvent[eventName]?.();

    setState(draft => {
        draft.eventName = eventName;
    });
};

export const NavigationRailItemBase: FC<NavigationRailItemBaseProps> = ({
    activeIcon = <Icon type="filled" name="circle" />,
    activeKey,
    dataKey,
    icon = <Icon type="outlined" name="circle" />,
    onActive,
    render,
    type = 'segment',
    ...renderProps
}) => {
    const [{eventName, layout, touchableLocation}, setState] = useImmer<InitialState>({
        eventName: 'none',
        layout: {} as LayoutRectangle,
        touchableLocation: {} as InitialState['touchableLocation'],
    });

    const id = useId();
    const theme = useTheme();
    const activeColor = theme.palette.secondary.secondaryContainer;
    const underlayColor = theme.palette.surface.onSurface;
    const active = typeof activeKey === 'string' ? activeKey === dataKey : undefined;
    const [{height, color}] = useAnimated({active, type});
    const iconLayout = useMemo(
        () => ({
            width: theme.adaptSize(theme.spacing.large),
            height: theme.adaptSize(theme.spacing.large),
        }),
        [theme],
    );

    const onStateChange = useCallback(
        (_state: State, options = {} as OnStateChangeOptions) =>
            processStateChange({...options, activeKey, dataKey, onActive, setState}),
        [activeKey, dataKey, onActive, setState],
    );

    const [onEvent] = useOnEvent({...renderProps, disabled: false, onStateChange});
    const activeIconElement = useMemo(
        () => cloneElement<IconProps>(activeIcon, {renderStyle: {...iconLayout}, eventName}),
        [activeIcon, eventName, iconLayout],
    );

    const iconElement = useMemo(
        () => cloneElement<IconProps>(icon, {renderStyle: {...iconLayout}, eventName}),
        [eventName, icon, iconLayout],
    );

    return render({
        ...renderProps,
        active,
        activeColor,
        activeIcon: activeIconElement,
        type,
        eventName,
        icon: iconElement,
        id,
        onEvent,
        touchableLocation,
        renderStyle: {
            color,
            height: layout.height,
            labelHeight: height,
            width: layout.width,
        },
        underlayColor,
    });
};
