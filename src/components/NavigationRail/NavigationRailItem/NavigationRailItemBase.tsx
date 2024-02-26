import {FC, RefAttributes, cloneElement, useCallback, useEffect, useId, useMemo} from 'react';
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
import {AnimatedInterpolation, ComponentStatus, EventName, State} from '../../Common/interface';
import {Icon} from '../../Icon/Icon';
import {useAnimated} from './useAnimated';

export interface NavigationRailItemProps
    extends Partial<ViewProps & RefAttributes<View> & Pick<ShapeProps, 'shape'> & PressableProps> {
    activeIcon?: React.JSX.Element;
    activeKey?: string;
    block?: boolean;
    defaultActiveKey?: string;
    icon?: React.JSX.Element;
    indexKey?: string;
    labelText?: string;
    onActive?: (key?: string) => void;
}

export interface RenderProps extends NavigationRailItemProps {
    active?: boolean;
    activeColor: string;
    activeLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    defaultActive?: boolean;
    eventName: EventName;
    onEvent: OnEvent;
    rippleCentered?: boolean;
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
    activeLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    eventName: EventName;
    layout: LayoutRectangle;
    rippleCentered: boolean;
    status: ComponentStatus;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessPressOutOptions = Pick<RenderProps, 'activeKey' | 'indexKey' | 'onActive'> &
    ProcessEventOptions;

type ProcessStateChangeOptions = OnStateChangeOptions & ProcessPressOutOptions;
type ProcessInitOptions = ProcessEventOptions & Pick<RenderProps, 'defaultActive'>;
type ProcessActiveOptions = ProcessEventOptions & Pick<RenderProps, 'active'>;

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processPressOut = (
    event: GestureResponderEvent,
    {indexKey, activeKey, onActive, setState}: ProcessPressOutOptions,
) => {
    if (activeKey === indexKey) {
        return;
    }

    const {locationX = 0, locationY = 0} = event.nativeEvent;

    setState(draft => {
        draft.activeLocation = {locationX, locationY};
        draft.rippleCentered = false;
    });

    onActive?.(indexKey);
};

const processStateChange = ({
    event,
    eventName,
    setState,
    activeKey,
    indexKey,
    onActive,
}: ProcessStateChangeOptions) => {
    const nextEvent = {
        layout: () => processLayout(event as LayoutChangeEvent, {setState}),
        pressOut: () =>
            processPressOut(event as GestureResponderEvent, {
                activeKey,
                indexKey,
                onActive,
                setState,
            }),
    };

    nextEvent[eventName as keyof typeof nextEvent]?.();

    setState(draft => {
        draft.eventName = eventName;
    });
};

const processInit = ({defaultActive, setState}: ProcessInitOptions) =>
    setState(draft => {
        if (draft.status !== 'idle') {
            return;
        }

        draft.rippleCentered = !!defaultActive;
        draft.status = 'succeeded';
    });

const processActive = ({setState, active}: ProcessActiveOptions) =>
    active &&
    setState(draft => {
        if (draft.status !== 'succeeded' || draft.activeLocation?.locationX) {
            return;
        }

        draft.rippleCentered = true;
        draft.activeLocation = {locationX: 0, locationY: 0};
    });

export const NavigationRailItemBase: FC<NavigationRailItemBaseProps> = ({
    activeIcon = <Icon type="filled" name="circle" />,
    activeKey,
    block,
    defaultActiveKey,
    icon = <Icon type="outlined" name="circle" />,
    indexKey,
    onActive,
    render,
    ...renderProps
}) => {
    const [{activeLocation, eventName, layout, rippleCentered, status}, setState] =
        useImmer<InitialState>({
            activeLocation: undefined,
            eventName: 'none',
            layout: {} as LayoutRectangle,
            rippleCentered: false,
            status: 'idle',
        });

    const theme = useTheme();
    const activeColor = theme.palette.secondary.secondaryContainer;
    const id = useId();
    const underlayColor = theme.palette.surface.onSurface;
    const active = typeof activeKey === 'string' ? activeKey === indexKey : undefined;
    const defaultActive = defaultActiveKey === indexKey;
    const [{height, color}] = useAnimated({active, block, defaultActive, setState});
    const iconLayout = useMemo(
        () => ({
            width: theme.adaptSize(theme.spacing.large),
            height: theme.adaptSize(theme.spacing.large),
        }),
        [theme],
    );

    const onStateChange = useCallback(
        (_state: State, options = {} as OnStateChangeOptions) =>
            processStateChange({...options, activeKey, indexKey, onActive, setState}),
        [activeKey, indexKey, onActive, setState],
    );

    const [onEvent] = useOnEvent({...renderProps, disabled: false, onStateChange});
    const activeIconElement = useMemo(
        () => cloneElement(activeIcon, {...iconLayout, eventName}),
        [activeIcon, eventName, iconLayout],
    );

    const iconElement = useMemo(
        () => cloneElement(icon, {...iconLayout, eventName}),
        [eventName, icon, iconLayout],
    );

    useEffect(() => {
        processActive({active, setState});
    }, [active, setState]);

    useEffect(() => {
        processInit({defaultActive, setState});
    }, [defaultActive, setState]);

    if (status === 'idle') {
        return <></>;
    }

    return render({
        ...renderProps,
        active,
        activeColor,
        activeIcon: activeIconElement,
        activeLocation,
        defaultActive,
        eventName,
        icon: iconElement,
        id,
        block,
        onEvent,
        rippleCentered,
        renderStyle: {
            color,
            height: layout?.height,
            labelHeight: height,
            width: layout?.width,
        },
        underlayColor,
    });
};
