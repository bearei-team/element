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
import {EventName, State} from '../Common/interface';
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
    defaultElevation?: ElevationLevel;
    elevation?: ElevationLevel;
    eventName: EventName;
}

export interface FABBaseProps extends FABProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const initialState = {
    elevation: undefined as ElevationLevel,
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
};

export const FABBase: FC<FABBaseProps> = props => {
    const {
        defaultElevation = 3,
        disabled,
        disabledElevation = false,
        icon,
        render,
        type = 'primary',
        ...renderProps
    } = props;

    const [{elevation, layout, eventName}, setState] = useImmer(initialState);
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
                draft.elevation = (level[nextState] + 3) as ElevationLevel;
            });
        },
        [setState],
    );

    const processLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const nativeEventLayout = event.nativeEvent.layout;

            setState(draft => {
                draft.layout = nativeEventLayout;
            });
        },
        [setState],
    );

    const processStateChange = useCallback(
        (nextState: State, options = {} as OnStateChangeOptions) => {
            const {event, eventName: nextEventName} = options;

            if (nextEventName === 'layout') {
                processLayout(event as LayoutChangeEvent);
            }

            if (nextEventName !== 'layout') {
                !disabledElevation && processElevation(nextState);
            }

            setState(draft => {
                draft.eventName = nextEventName;
            });
        },
        [disabledElevation, processElevation, processLayout, setState],
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
        if (typeof disabled === 'boolean' && !disabledElevation) {
            setState(draft => {
                draft.elevation = disabled ? 0 : 3;
            });
        }
    }, [disabled, disabledElevation, setState]);

    return render({
        ...renderProps,
        elevation,
        defaultElevation,
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
