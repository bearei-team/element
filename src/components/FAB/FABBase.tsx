import {FC, useCallback, useEffect, useId} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextStyle, ViewStyle} from 'react-native';
import {Updater, useImmer} from 'use-immer';
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

export interface ProcessEventOptions {
    setState: Updater<typeof initialState>;
}

export type ProcessStateChangeOptions = Pick<RenderProps, 'disabledElevation'> &
    ProcessEventOptions &
    OnStateChangeOptions;

const processElevation = (nextState: State, {setState}: ProcessEventOptions) => {
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
};

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processStateChange = (
    state: State,
    {event, eventName, disabledElevation, setState}: ProcessStateChangeOptions,
) => {
    if (eventName === 'layout') {
        processLayout(event as LayoutChangeEvent, {setState});
    }

    if (eventName !== 'layout') {
        !disabledElevation && processElevation(state, {setState});
    }

    setState(draft => {
        draft.eventName = eventName;
    });
};

const initialState = {
    elevation: undefined as ElevationLevel,
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
};

export const FABBase: FC<FABBaseProps> = ({
    defaultElevation = 3,
    disabled,
    disabledElevation,
    icon,
    render,
    type = 'primary',
    ...renderProps
}) => {
    const [{elevation, layout, eventName}, setState] = useImmer(initialState);
    const [underlayColor] = useUnderlayColor({type});
    const id = useId();
    const onStateChange = useCallback(
        (state: State, options = {} as OnStateChangeOptions) =>
            processStateChange(state, {...options, disabledElevation, setState}),
        [disabledElevation, setState],
    );

    const [onEvent] = HOOK.useOnEvent({...renderProps, disabled, onStateChange});
    const [{backgroundColor, color}] = useAnimated({disabled, type});
    const [iconElement] = useIcon({eventName, type, icon, disabled});

    useEffect(() => {
        if (!(typeof disabled === 'boolean' && !disabledElevation)) {
            return;
        }

        setState(draft => {
            draft.elevation = disabled ? 0 : 3;
        });
    }, [disabled, disabledElevation, setState]);

    useEffect(() => {
        if (!disabled) {
            return;
        }

        setState(draft => {
            draft.eventName = 'none';
        });
    }, [disabled, setState]);

    return render({
        ...renderProps,
        defaultElevation: disabledElevation ? 0 : defaultElevation,
        elevation,
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
