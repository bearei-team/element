import {FC, useCallback, useEffect, useId} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextStyle, ViewStyle} from 'react-native';
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

const processStateChange = (
    state: State,
    {event, eventName, elevated, setState}: ProcessStateChangeOptions,
) => {
    if (eventName === 'layout') {
        processLayout(event as LayoutChangeEvent, {setState});
    }

    processElevation(state, {elevated, setState});

    setState(draft => {
        draft.eventName = eventName;
    });
};

const initialState = {
    defaultElevation: undefined as ElevationLevel,
    elevation: undefined as ElevationLevel,
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
    status: 'idle' as ComponentStatus,
};

export const ChipBase: FC<ChipBaseProps> = ({
    disabled,
    elevated = false,
    icon,
    labelText = 'Label',
    render,
    type = 'filter',
    ...renderProps
}) => {
    const [{defaultElevation, elevation, eventName, layout, status}, setState] =
        useImmer(initialState);

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
        if (status !== 'idle') {
            return;
        }

        setState(draft => {
            elevated && (draft.defaultElevation = 1);
            draft.status = 'succeeded';
        });
    }, [elevated, setState, status]);

    useEffect(() => {
        const setElevation = typeof disabled === 'boolean' && elevated;

        if (!setElevation) {
            return;
        }

        setState(draft => {
            draft.elevation = disabled ? 0 : 1;
        });
    }, [disabled, elevated, setState]);

    useEffect(() => {
        if (!disabled) {
            return;
        }

        setState(draft => {
            draft.eventName = 'none';
        });
    }, [disabled, setState]);

    if (status === 'idle') {
        return <></>;
    }

    return render({
        ...renderProps,
        defaultElevation,
        disabled,
        elevation,
        eventName,
        icon: iconElement,
        id,
        labelText,
        onEvent,
        type,
        underlayColor,
        activeColor,
        renderStyle: {
            ...border,
            backgroundColor,
            color,
            height: layout.height,
            width: layout.width,
        },
    });
};
