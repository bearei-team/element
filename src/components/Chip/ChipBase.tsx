import {FC, useCallback, useEffect, useId} from 'react';
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
import {HOOK} from '../../hooks/hook';
import {OnEvent, OnStateChangeOptions} from '../../hooks/useOnEvent';
import {ComponentStatus, EventName, State} from '../Common/interface';
import {ElevationLevel} from '../Elevation/Elevation';
import {ChipProps} from './Chip';
import {useAnimated} from './useAnimated';
import {useBorder} from './useBorder';
import {useIcon} from './useIcon';
import {useUnderlayColor} from './useUnderlayColor';

export interface RenderProps extends ChipProps {
    defaultElevation: ElevationLevel;
    elevation: ElevationLevel;
    eventName: EventName;
    onEvent: OnEvent;
    activeColor: string;
    activeLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    rippleCentered?: boolean;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height: number;
        width: number;
    };
}

export interface ChipBaseProps extends ChipProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface ProcessEventOptions {
    setState: Updater<typeof initialState>;
}

export type ProcessElevationOptions = Pick<RenderProps, 'elevated'> & ProcessEventOptions;
export type ProcessLayoutOptions = Pick<RenderProps, 'elevated'> & ProcessEventOptions;
export type ProcessContentLayoutOptions = ProcessEventOptions;
export type ProcessStateChangeOptions = OnStateChangeOptions & ProcessLayoutOptions;
export type ProcessInitOptions = Pick<RenderProps, 'elevated' | 'defaultActive'> &
    ProcessEventOptions;

export type ProcessDisabledElevationOptions = Pick<RenderProps, 'elevated'> & ProcessEventOptions;
export type ProcessActiveOptions = Pick<RenderProps, 'active'> & ProcessEventOptions;

const processCorrectionCoefficient = ({elevated}: Pick<RenderProps, 'elevated'>) =>
    elevated ? 1 : 0;

const processElevation = (state: State, {elevated, setState}: ProcessElevationOptions) => {
    if (!elevated) {
        return;
    }

    const level = {
        disabled: 0,
        enabled: 0,
        error: 0,
        focused: 0,
        hovered: 1,
        longPressIn: 0,
        pressIn: 0,
    };

    const correctionCoefficient = processCorrectionCoefficient({elevated});

    setState(draft => {
        draft.elevation = (level[state] + correctionCoefficient) as ElevationLevel;
    });
};

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessLayoutOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processPressOut = (event: GestureResponderEvent, {setState}: ProcessEventOptions) => {
    const {locationX = 0, locationY = 0} = event.nativeEvent;

    setState(draft => {
        draft.activeLocation = {locationX, locationY};
    });
};

const processStateChange = (
    state: State,
    {event, eventName, elevated, setState}: ProcessStateChangeOptions,
) => {
    const nextEvent = {
        layout: () => processLayout(event as LayoutChangeEvent, {setState}),
        pressOut: () =>
            processPressOut(event as GestureResponderEvent, {
                setState,
            }),
    };

    nextEvent[eventName as keyof typeof nextEvent]?.();

    processElevation(state, {elevated, setState});

    setState(draft => {
        draft.eventName = eventName;
    });
};

const processInit = (
    status: ComponentStatus,
    {defaultActive, elevated, setState}: ProcessInitOptions,
) =>
    status === 'idle' &&
    setState(draft => {
        elevated && (draft.defaultElevation = 1);

        if (typeof defaultActive === 'boolean') {
            draft.rippleCentered = defaultActive;
            draft.defaultActive = defaultActive;
        }

        draft.status = 'succeeded';
    });

const processDisabledElevation = (
    {elevated, setState}: ProcessDisabledElevationOptions,
    disabled?: boolean,
) => {
    const setElevation = typeof disabled === 'boolean' && elevated;

    setElevation &&
        setState(draft => {
            draft.elevation = disabled ? 0 : 1;
        });
};

const processDisabled = ({setState}: ProcessEventOptions, disabled?: boolean) =>
    disabled &&
    setState(draft => {
        draft.eventName = 'none';
    });

const processActive = (status: ComponentStatus, {active, setState}: ProcessActiveOptions) => {
    const setActive = status === 'succeeded' && typeof active === 'boolean';

    setActive &&
        setState(draft => {
            draft.active = active;

            if (draft.activeLocation?.locationX) {
                return;
            }

            draft.rippleCentered = true;
            draft.activeLocation = {locationX: 0, locationY: 0};
        });
};

const initialState = {
    defaultElevation: undefined as ElevationLevel,
    elevation: undefined as ElevationLevel,
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
    status: 'idle' as ComponentStatus,
    activeLocation: undefined as Pick<NativeTouchEvent, 'locationX' | 'locationY'> | undefined,
    active: undefined as boolean | undefined,
    defaultActive: undefined as boolean | undefined,
    rippleCentered: false,
};

export const ChipBase: FC<ChipBaseProps> = ({
    active: activeSource,
    defaultActive: defaultActiveSource,
    disabled,
    elevated = false,
    icon,
    labelText = 'Label',
    render,
    type = 'filter',
    ...renderProps
}) => {
    const [
        {
            active,
            activeLocation,
            defaultActive,
            defaultElevation,
            elevation,
            eventName,
            layout,
            rippleCentered,
            status,
        },
        setState,
    ] = useImmer(initialState);

    const theme = useTheme();
    const id = useId();
    const [underlayColor] = useUnderlayColor({type, elevated});
    const activeColor = theme.palette.secondary.secondaryContainer;
    const onStateChange = useCallback(
        (state: State, options = {} as OnStateChangeOptions) =>
            processStateChange(state, {...options, elevated, setState}),
        [setState, elevated],
    );

    const [onEvent] = HOOK.useOnEvent({...renderProps, disabled, onStateChange});
    const [{backgroundColor, borderColor, color}] = useAnimated({disabled, eventName, type});
    const [iconElement] = useIcon({eventName, type, icon, disabled});
    const [border] = useBorder({type, borderColor});

    useEffect(() => {
        processInit(status, {defaultActive: defaultActiveSource, elevated, setState});
    }, [defaultActiveSource, elevated, setState, status]);

    useEffect(() => {
        processDisabledElevation({elevated, setState}, disabled);
    }, [disabled, elevated, setState]);

    useEffect(() => {
        processDisabled({setState}, disabled);
    }, [disabled, setState]);

    useEffect(() => {
        processActive(status, {active: activeSource, setState});
    }, [activeSource, setState, status]);

    if (status === 'idle') {
        return <></>;
    }

    return render({
        ...renderProps,
        active,
        activeColor,
        activeLocation,
        defaultActive,
        defaultElevation,
        disabled,
        elevation,
        eventName,
        icon: iconElement,
        id,
        labelText,
        onEvent,
        rippleCentered,
        type,
        underlayColor,
        renderStyle: {
            ...border,
            backgroundColor,
            color,
            height: layout.height,
            width: layout.width,
        },
    });
};
