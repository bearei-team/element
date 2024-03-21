import {RefAttributes, cloneElement, forwardRef, useCallback, useId, useMemo} from 'react';
import {
    Animated,
    GestureResponderEvent,
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

export type NavigationBarType = 'segment' | 'block';
export interface NavigationBarItemProps
    extends Partial<ViewProps & RefAttributes<View> & Pick<ShapeProps, 'shape'> & PressableProps> {
    activeKey?: string;
    type?: NavigationBarType;
    dataKey?: string;
    icon?: React.JSX.Element;
    labelText?: string;
    onActive?: (key?: string) => void;
}

export interface RenderProps extends NavigationBarItemProps {
    active?: boolean;
    activeColor: string;
    eventName: EventName;
    onEvent: OnEvent;
    touchableLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        labelHeight: AnimatedInterpolation;
    };
    underlayColor: string;
}

interface NavigationBarItemBaseProps extends NavigationBarItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface InitialState {
    eventName: EventName;
    touchableLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessPressOutOptions = Pick<RenderProps, 'activeKey' | 'dataKey' | 'onActive'> &
    ProcessEventOptions;

type ProcessStateChangeOptions = OnStateChangeOptions & ProcessPressOutOptions;

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

export const NavigationBarItemBase = forwardRef<View, NavigationBarItemBaseProps>(
    (
        {
            activeKey,
            dataKey,
            icon = <Icon name="circle" />,
            onActive,
            render,
            type = 'segment',
            ...renderProps
        },
        ref,
    ) => {
        const [{eventName, touchableLocation}, setState] = useImmer<InitialState>({
            eventName: 'none',
            touchableLocation: {} as InitialState['touchableLocation'],
        });

        const id = useId();
        const theme = useTheme();
        const activeColor = theme.palette.secondary.secondaryContainer;
        const underlayColor = theme.palette.surface.onSurface;
        const active = activeKey === dataKey;
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
        const iconElement = useMemo(
            () => cloneElement<IconProps>(icon, {renderStyle: {...iconLayout}, eventName}),
            [eventName, icon, iconLayout],
        );

        return render({
            ...renderProps,
            active,
            activeColor,
            eventName,
            icon: iconElement,
            id,
            onEvent,
            touchableLocation,
            type,
            ref,
            renderStyle: {color, labelHeight: height},
            underlayColor,
        });
    },
);
