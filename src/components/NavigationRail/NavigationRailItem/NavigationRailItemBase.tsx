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
import {useImmer} from 'use-immer';
import {HOOK} from '../../../hooks/hook';
import {OnEvent, OnStateChangeOptions} from '../../../hooks/useOnEvent';
import {
    AnimatedInterpolation,
    ComponentStatus,
    EventName,
    State,
} from '../../Common/interface';
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

const initialState = {
    activeLocation: {} as Pick<NativeTouchEvent, 'locationX' | 'locationY'>,
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
    rippleCentered: false,
    status: 'idle' as ComponentStatus,
};

export const NavigationRailItemBase: FC<
    NavigationRailItemBaseProps
> = props => {
    const {
        activeIcon = <Icon type="filled" name="circle" />,
        activeKey,
        block = false,
        defaultActiveKey,
        icon = <Icon type="outlined" name="circle" />,
        indexKey,
        onActive,
        render,
        ...renderProps
    } = props;

    const [
        {activeLocation, eventName, layout, rippleCentered, status},
        setState,
    ] = useImmer(initialState);

    const theme = useTheme();
    const activeColor = theme.palette.secondary.secondaryContainer;
    const id = useId();
    const underlayColor = theme.palette.surface.onSurface;
    const active =
        typeof activeKey === 'string' ? activeKey === indexKey : undefined;

    const defaultActive = defaultActiveKey === indexKey;
    const [{height, color}] = useAnimated({
        active,
        block,
        defaultActive,
    });

    const processLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const nativeEventLayout = event.nativeEvent.layout;

            setState(draft => {
                draft.layout = nativeEventLayout;
            });
        },
        [setState],
    );

    const processPressOut = useCallback(
        (event: GestureResponderEvent) => {
            const responseActive = activeKey !== indexKey;
            const {locationX = 0, locationY = 0} = event.nativeEvent;

            if (responseActive) {
                setState(draft => {
                    draft.activeLocation = {locationX, locationY};
                });

                onActive?.(indexKey);
            }
        },
        [activeKey, indexKey, onActive, setState],
    );

    const processStateChange = useCallback(
        (_nextState: State, options = {} as OnStateChangeOptions) => {
            const {event, eventName: nextEventName} = options;
            const nextEvent = {
                layout: () => {
                    processLayout(event as LayoutChangeEvent);
                },
                pressOut: () => {
                    processPressOut(event as GestureResponderEvent);
                },
            };

            nextEvent[nextEventName as keyof typeof nextEvent]?.();

            setState(draft => {
                draft.eventName = nextEventName;
            });
        },
        [processLayout, processPressOut, setState],
    );
    const [onEvent] = HOOK.useOnEvent({
        ...props,
        disabled: false,
        onStateChange: processStateChange,
    });

    const activeIconElement = useMemo(
        () => cloneElement(activeIcon, {eventName}),
        [activeIcon, eventName],
    );

    const iconElement = useMemo(
        () => cloneElement(icon, {eventName}),
        [eventName, icon],
    );

    useEffect(() => {
        if (status === 'idle') {
            setState(draft => {
                draft.rippleCentered = !!defaultActive;
                draft.status = 'succeeded';
            });
        }
    }, [defaultActive, setState, status]);

    useEffect(() => {
        setState(draft => {
            const uncenter =
                draft.status === 'succeeded' &&
                typeof active === 'boolean' &&
                active &&
                defaultActive;

            if (uncenter) {
                draft.rippleCentered = false;
            }
        });
    }, [active, defaultActive, setState]);

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
