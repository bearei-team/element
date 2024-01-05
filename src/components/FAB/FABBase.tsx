import {FC, useCallback, useEffect, useId} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    TextStyle,
    ViewStyle,
} from 'react-native';
import {useImmer} from 'use-immer';
import {HOOK} from '../../hooks/hook';
import {OnEvent, OnStateChangeOptions} from '../../hooks/useOnEvent';
import {ComponentStatus, EventName, State} from '../Common/interface';
import {ElevationLevel} from '../Elevation/Elevation';
import {FABProps} from './FAB';
import {useAnimated} from './useAnimated';
import {useIcon} from './useIcon';
import {useUnderlayColor} from './useUnderlayColor';

export interface RenderProps extends FABProps {
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height: number;
        width: number;
    };
    defaultElevationLevel: ElevationLevel;
    elevationLevel: ElevationLevel;
    eventName: EventName;
}

export interface FABBaseProps extends FABProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const initialState = {
    defaultElevationLevel: 0 as ElevationLevel,
    elevationLevel: undefined as ElevationLevel,
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
    status: 'idle' as ComponentStatus,
};

export const FABBase: FC<FABBaseProps> = props => {
    const {
        disabled = false,
        icon,
        render,
        type = 'primary',
        ...renderProps
    } = props;

    const [
        {elevationLevel, defaultElevationLevel, status, layout, eventName},
        setState,
    ] = useImmer(initialState);

    const [underlayColor] = useUnderlayColor({type});
    const id = useId();

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

            setState(draft => {
                draft.elevationLevel = (level[nextState] + 3) as ElevationLevel;
            });
        },
        [setState],
    );

    const processStateChange = useCallback(
        (nextState: State, options = {} as OnStateChangeOptions) => {
            const {event, eventName: nextEventName} = options;

            if (nextEventName === 'layout') {
                const nativeEventLayout = (event as LayoutChangeEvent)
                    .nativeEvent.layout;

                setState(draft => {
                    draft.layout = nativeEventLayout;
                });
            }

            if (nextEventName !== 'layout') {
                processElevation(nextState);
            }

            setState(draft => {
                draft.eventName = nextEventName;
            });
        },
        [processElevation, setState],
    );

    const [onEvent] = HOOK.useOnEvent({
        ...props,
        disabled,
        onStateChange: processStateChange,
    });

    const [{backgroundColor, color}] = useAnimated({
        disabled,
        type,
    });

    const [iconElement] = useIcon({eventName, type, icon, disabled});

    useEffect(() => {
        if (status === 'idle') {
            setState(draft => {
                draft.defaultElevationLevel = 3;
                draft.status = 'succeeded';
            });
        }
    }, [setState, status]);

    useEffect(() => {
        const setElevationLevel =
            typeof disabled === 'boolean' && status === 'succeeded';

        if (setElevationLevel) {
            setState(draft => {
                draft.elevationLevel = disabled ? 0 : 3;
            });
        }
    }, [disabled, setState, status]);

    if (status === 'idle') {
        return <></>;
    }

    return render({
        ...renderProps,
        defaultElevationLevel,
        elevationLevel,
        eventName,
        icon: iconElement,
        id,
        onEvent,
        type,
        underlayColor,
        renderStyle: {
            backgroundColor,
            color,
            height: layout?.height,
            width: layout?.width,
        },
    });
};
