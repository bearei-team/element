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
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {ComponentStatus, EventName, State} from '../Common/interface';
import {ElevationLevel} from '../Elevation/Elevation';
import {ChipProps} from './Chip';
import {useAnimated} from './useAnimated';
import {useBorder} from './useBorder';
import {useIcon} from './useIcon';
import {useUnderlayColor} from './useUnderlayColor';

export interface RenderProps extends ChipProps {
    activeColor: string;
    activeLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    defaultElevation: ElevationLevel;
    elevation: ElevationLevel;
    eventName: EventName;
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height: number;
        width: number;
    };
    rippleCentered?: boolean;
}

export interface ChipBaseProps extends ChipProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface InitialState {
    active?: boolean;
    activeLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    defaultActive?: boolean;
    defaultElevation?: ElevationLevel;
    elevation?: ElevationLevel;
    eventName: EventName;
    layout: LayoutRectangle;
    rippleCentered: boolean;
    status: ComponentStatus;
}

export interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

export type ProcessActiveOptions = Pick<RenderProps, 'active'> & ProcessEventOptions;
export type ProcessContentLayoutOptions = ProcessEventOptions;
export type ProcessDisabledElevationOptions = Pick<RenderProps, 'elevated'> & ProcessEventOptions;
export type ProcessElevationOptions = Pick<RenderProps, 'elevated'> & ProcessEventOptions;
export type ProcessInitOptions = Pick<RenderProps, 'elevated' | 'defaultActive'> &
    ProcessEventOptions;

export type ProcessLayoutOptions = Pick<RenderProps, 'elevated'> & ProcessEventOptions;
export type ProcessStateChangeOptions = OnStateChangeOptions & ProcessLayoutOptions;

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
        pressOut: () => processPressOut(event as GestureResponderEvent, {setState}),
    };

    nextEvent[eventName as keyof typeof nextEvent]?.();

    processElevation(state, {elevated, setState});

    setState(draft => {
        draft.eventName = eventName;
    });
};

const processInit = ({defaultActive, elevated, setState}: ProcessInitOptions) =>
    setState(draft => {
        if (draft.status !== 'idle') {
            return;
        }

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
) =>
    typeof disabled === 'boolean' &&
    elevated &&
    setState(draft => {
        draft.elevation = disabled ? 0 : 1;
    });

const processDisabled = ({setState}: ProcessEventOptions, disabled?: boolean) =>
    disabled &&
    setState(draft => {
        draft.eventName = 'none';
    });

const processActive = ({active, setState}: ProcessActiveOptions) => {
    typeof active === 'boolean' &&
        setState(draft => {
            if (draft.status !== 'succeeded' || draft.active === active) {
                return;
            }

            draft.active = active;

            if (!draft.activeLocation?.locationX) {
                draft.rippleCentered = true;
                draft.activeLocation = {locationX: 0, locationY: 0};
            }
        });
};

export const ChipBase: FC<ChipBaseProps> = ({
    active: activeSource,
    defaultActive: defaultActiveSource,
    disabled,
    elevated = false,
    fill,
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
    ] = useImmer<InitialState>({
        active: undefined,
        activeLocation: undefined,
        defaultActive: undefined,
        defaultElevation: undefined,
        elevation: undefined,
        eventName: 'none',
        layout: {} as LayoutRectangle,
        rippleCentered: false,
        status: 'idle',
    });

    const theme = useTheme();
    const id = useId();
    const [underlayColor] = useUnderlayColor({type, elevated});
    const activeColor = theme.palette.secondary.secondaryContainer;
    const onStateChange = useCallback(
        (state: State, options = {} as OnStateChangeOptions) =>
            processStateChange(state, {...options, elevated, setState}),
        [setState, elevated],
    );

    const [onEvent] = useOnEvent({...renderProps, disabled, onStateChange});
    const [{backgroundColor, borderColor, color}] = useAnimated({disabled, eventName, type});
    const [iconElement] = useIcon({eventName, type, icon, disabled, fill});
    const [border] = useBorder({type, borderColor});

    useEffect(() => {
        processDisabledElevation({elevated, setState}, disabled);
    }, [disabled, elevated, setState]);

    useEffect(() => {
        processDisabled({setState}, disabled);
    }, [disabled, setState]);

    useEffect(() => {
        processActive({active: activeSource, setState});
    }, [activeSource, setState]);

    useEffect(() => {
        processInit({defaultActive: defaultActiveSource, elevated, setState});
    }, [defaultActiveSource, elevated, setState]);

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
