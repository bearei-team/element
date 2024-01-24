import {FC, cloneElement, useEffect, useId, useMemo} from 'react';
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
import {HOOK} from '../../../hooks/hook';
import {OnEvent, OnStateChangeOptions} from '../../../hooks/useOnEvent';
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

export interface ProcessEventOptions {
    setState: Updater<typeof initialState>;
}

export type ProcessPressOutOptions = Pick<RenderProps, 'activeKey' | 'indexKey' | 'onActive'> &
    ProcessEventOptions;

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

    if (responseActive) {
        setState(draft => {
            draft.activeLocation = {locationX, locationY};
        });

        onActive?.(indexKey);
    }
};

const processStateChange =
    ({setState, activeKey, indexKey, onActive}: ProcessPressOutOptions) =>
    (_state: State, {event, eventName} = {} as OnStateChangeOptions) => {
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

const initialState = {
    activeLocation: undefined as Pick<NativeTouchEvent, 'locationX' | 'locationY'> | undefined,
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
    rippleCentered: false,
    status: 'idle' as ComponentStatus,
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
        useImmer(initialState);

    const theme = useTheme();
    const activeColor = theme.palette.secondary.secondaryContainer;
    const id = useId();
    const underlayColor = theme.palette.surface.onSurface;
    const active = typeof activeKey === 'string' ? activeKey === indexKey : undefined;
    const defaultActive = defaultActiveKey === indexKey;
    const [{height, color}] = useAnimated({
        active,
        block,
        defaultActive,
    });

    const onStateChange = useMemo(
        () => processStateChange({activeKey, indexKey, onActive, setState}),
        [activeKey, indexKey, onActive, setState],
    );

    const [onEvent] = HOOK.useOnEvent({
        ...renderProps,
        disabled: false,
        onStateChange,
    });

    const activeIconElement = useMemo(
        () => cloneElement(activeIcon, {eventName}),
        [activeIcon, eventName],
    );

    const iconElement = useMemo(() => cloneElement(icon, {eventName}), [eventName, icon]);

    useEffect(() => {
        if (status === 'idle') {
            setState(draft => {
                draft.rippleCentered = !!defaultActive;
                draft.status = 'succeeded';
            });
        }
    }, [defaultActive, setState, status]);

    useEffect(() => {
        if (status === 'succeeded' && active) {
            setState(draft => {
                if (!draft.activeLocation?.locationX) {
                    draft.rippleCentered = true;
                    draft.activeLocation = {locationX: 0, locationY: 0};
                }
            });
        }
    }, [active, setState, status]);

    useEffect(() => {
        if (activeLocation?.locationX) {
            setState(draft => {
                draft.rippleCentered = false;
            });
        }
    }, [activeLocation, setState]);

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
