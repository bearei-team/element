import {FC, useCallback, useEffect, useId} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextStyle, ViewStyle} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {EventName, Size, State} from '../Common/interface';
import {ElevationLevel} from '../Elevation/Elevation';
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {useAnimated} from './useAnimated';
import {useIcon} from './useIcon';
import {useUnderlayColor} from './useUnderlayColor';

type FABType = 'surface' | 'primary' | 'secondary' | 'tertiary';
export interface FABProps extends TouchableRippleProps {
    defaultElevation?: ElevationLevel;
    disabled?: boolean;
    elevated?: boolean;
    icon?: React.JSX.Element;
    labelText?: string;
    size?: Size;
    type?: FABType;
}

export interface RenderProps extends FABProps {
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height: number;
        width: number;
    };
    defaultElevation?: ElevationLevel;
    elevation?: ElevationLevel;
    eventName?: EventName;
}

interface FABBaseProps extends FABProps {
    render: (props: RenderProps) => React.JSX.Element;
}

interface InitialState {
    elevation?: ElevationLevel;
    eventName: EventName;
    layout: LayoutRectangle;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessStateChangeOptions = Pick<RenderProps, 'elevated'> &
    ProcessEventOptions &
    OnStateChangeOptions;

type ProcessDisabledElevationOptions = Pick<RenderProps, 'elevated'> & ProcessEventOptions;

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
    {event, eventName, elevated, setState}: ProcessStateChangeOptions,
) => {
    eventName === 'layout' && processLayout(event as LayoutChangeEvent, {setState});
    elevated && processElevation(state, {setState});

    setState(draft => {
        draft.eventName = eventName;
    });
};

const processDisabledElevation = (
    {elevated, setState}: ProcessDisabledElevationOptions,
    disabled?: boolean,
) =>
    typeof disabled === 'boolean' &&
    elevated &&
    setState(draft => {
        draft.elevation = disabled ? 0 : 3;
    });

const processDisabled = ({setState}: ProcessEventOptions, disabled?: boolean) =>
    disabled &&
    setState(draft => {
        draft.eventName = 'none';
    });

export const FABBase: FC<FABBaseProps> = ({
    defaultElevation = 3,
    disabled,
    elevated = true,
    icon,
    render,
    size,
    type = 'primary',
    ...renderProps
}) => {
    const [{elevation, layout, eventName}, setState] = useImmer<InitialState>({
        elevation: undefined,
        eventName: 'none',
        layout: {} as LayoutRectangle,
    });

    const [underlayColor] = useUnderlayColor({type});
    const id = useId();
    const onStateChange = useCallback(
        (state: State, options = {} as OnStateChangeOptions) =>
            processStateChange(state, {...options, elevated, setState}),
        [elevated, setState],
    );

    const [onEvent] = useOnEvent({...renderProps, disabled, onStateChange});
    const [{backgroundColor, color}] = useAnimated({disabled, type});
    const [iconElement] = useIcon({eventName, type, icon, disabled, size});

    useEffect(() => {
        processDisabledElevation({elevated, setState}, disabled);
    }, [disabled, elevated, setState]);

    useEffect(() => {
        processDisabled({setState}, disabled);
    }, [disabled, setState]);

    return render({
        ...renderProps,
        defaultElevation: elevated ? defaultElevation : 0,
        elevation,
        eventName,
        icon: iconElement,
        id,
        onEvent,
        size,
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
