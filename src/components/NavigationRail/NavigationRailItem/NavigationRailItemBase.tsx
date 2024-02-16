import {FC, cloneElement, useCallback, useEffect, useId, useMemo} from 'react';
import {
    Animated,
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    NativeTouchEvent,
    TextStyle,
    ViewStyle,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../../hooks/useOnEvent';
import {AnimatedInterpolation, ComponentStatus, EventName, State} from '../../Common/interface';
import {Icon} from '../../Icon/Icon';
import {NavigationRailItemProps} from './NavigationRailItem';
import {useAnimated} from './useAnimated';

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
        width: number;
        labelHeight: AnimatedInterpolation;
    };
    underlayColor: string;
}

export interface NavigationRailItemBaseProps extends NavigationRailItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface InitialState {
    activeLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    eventName: EventName;
    layout: LayoutRectangle;
    rippleCentered: boolean;
    status: ComponentStatus;
}

export interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

export type ProcessPressOutOptions = Pick<RenderProps, 'activeKey' | 'indexKey' | 'onActive'> &
    ProcessEventOptions;

export type ProcessStateChangeOptions = OnStateChangeOptions & ProcessPressOutOptions;
export type ProcessInitOptions = ProcessEventOptions & Pick<RenderProps, 'defaultActive'>;
export type ProcessActiveOptions = ProcessEventOptions & Pick<RenderProps, 'active'>;

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
    const responseActive = indexKey !== activeKey;
    const {locationX = 0, locationY = 0} = event.nativeEvent;

    if (!responseActive) {
        return;
    }

    setState(draft => {
        draft.activeLocation = {locationX, locationY};
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

const processInit = (status: ComponentStatus, {defaultActive, setState}: ProcessInitOptions) => {
    status === 'idle' &&
        setState(draft => {
            draft.rippleCentered = !!defaultActive;
            draft.status = 'succeeded';
        });
};

const processActive = (status: ComponentStatus, {setState, active}: ProcessActiveOptions) => {
    const setActive = status === 'succeeded' && active;

    setActive &&
        setState(draft => {
            if (draft.activeLocation?.locationX) {
                return;
            }

            draft.rippleCentered = true;
            draft.activeLocation = {locationX: 0, locationY: 0};
        });
};

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
    const [{height, color}] = useAnimated({active, block, defaultActive});
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
        processInit(status, {defaultActive, setState});
    }, [defaultActive, setState, status]);

    useEffect(() => {
        processActive(status, {active, setState});
    }, [active, setState, status]);

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
