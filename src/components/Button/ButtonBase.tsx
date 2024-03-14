import {forwardRef, useCallback, useEffect, useId} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {ComponentStatus, EventName, State} from '../Common/interface';
import {ElevationLevel} from '../Elevation/Elevation';
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {useAnimated} from './useAnimated';
import {useBorder} from './useBorder';
import {useIcon} from './useIcon';
import {useUnderlayColor} from './useUnderlayColor';

type ButtonType = 'elevated' | 'filled' | 'link' | 'outlined' | 'text' | 'tonal';
export interface ButtonProps extends TouchableRippleProps {
    block?: boolean;
    icon?: React.JSX.Element;
    labelText?: string;
    type?: ButtonType;
}

export interface RenderProps extends ButtonProps {
    elevation: ElevationLevel;
    eventName: EventName;
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height: number;
        width: number;
    };
}

interface ButtonBaseProps extends ButtonProps {
    render: (props: RenderProps) => React.JSX.Element;
}

interface InitialState {
    elevation?: ElevationLevel;
    eventName: EventName;
    layout: LayoutRectangle;
    status: ComponentStatus;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessElevationOptions = Pick<RenderProps, 'type'> & ProcessEventOptions;
type ProcessInitOptions = Pick<RenderProps, 'type' | 'disabled'> & ProcessEventOptions;
type ProcessStateChangeOptions = OnStateChangeOptions & ProcessElevationOptions;

const processCorrectionCoefficient = ({type}: Pick<RenderProps, 'type'>) =>
    type === 'elevated' ? 1 : 0;

const processElevation = (state: State, {type = 'filled', setState}: ProcessElevationOptions) => {
    const elevationType = ['elevated', 'filled', 'tonal'].includes(type);

    if (!elevationType) {
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

    const correctionCoefficient = processCorrectionCoefficient({type});

    setState(draft => {
        draft.elevation = (
            state === 'disabled' ? level[state] : level[state] + correctionCoefficient
        ) as ElevationLevel;
    });
};

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        const update =
            draft.layout.width !== nativeEventLayout.width ||
            draft.layout.height !== nativeEventLayout.height;

        update && (draft.layout = nativeEventLayout);
    });
};

const processStateChange = (
    state: State,
    {event, eventName, type, setState}: ProcessStateChangeOptions,
) => {
    eventName === 'layout'
        ? processLayout(event as LayoutChangeEvent, {setState})
        : processElevation(state, {type, setState});

    setState(draft => {
        draft.eventName = eventName;
    });
};

const processInit = ({type, setState, disabled}: ProcessInitOptions) =>
    setState(draft => {
        if (draft.status !== 'idle') {
            return;
        }

        type === 'elevated' && !disabled && (draft.elevation = 1);
        draft.status = 'succeeded';
    });

const processDisabledElevation = ({type, setState}: ProcessInitOptions, disabled?: boolean) =>
    typeof disabled === 'boolean' &&
    type === 'elevated' &&
    setState(draft => {
        draft.elevation = disabled ? 0 : 1;
    });

const processDisabled = ({setState}: ProcessEventOptions, disabled?: boolean) =>
    disabled &&
    setState(draft => {
        draft.eventName = 'none';
    });

export const ButtonBase = forwardRef<View, ButtonBaseProps>(
    ({disabled, icon, labelText = 'Label', render, type = 'filled', ...renderProps}, ref) => {
        const [{elevation, eventName, layout, status}, setState] = useImmer<InitialState>({
            elevation: undefined,
            eventName: 'none',
            layout: {} as LayoutRectangle,
            status: 'idle',
        });

        const id = useId();
        const [underlayColor] = useUnderlayColor({type});
        const onStateChange = useCallback(
            (state: State, options = {} as OnStateChangeOptions) =>
                processStateChange(state, {...options, type, setState}),
            [setState, type],
        );

        const [onEvent] = useOnEvent({...renderProps, disabled, onStateChange});
        const [{backgroundColor, borderColor, color}] = useAnimated({disabled, eventName, type});
        const [iconElement] = useIcon({eventName, type, icon, disabled});
        const [border] = useBorder({type, borderColor});

        useEffect(() => {
            processDisabledElevation({setState, type}, disabled);
        }, [disabled, setState, type]);

        useEffect(() => {
            processDisabled({setState}, disabled);
        }, [disabled, setState]);

        useEffect(() => {
            processInit({type, setState, disabled});
        }, [disabled, setState, type]);

        if (status === 'idle') {
            return <></>;
        }

        return render({
            ...renderProps,
            disabled,
            elevation,
            eventName,
            icon: iconElement,
            id,
            labelText,
            onEvent,
            ref,
            renderStyle: {
                ...border,
                backgroundColor,
                color,
                height: layout.height,
                width: layout.width,
            },
            type,
            underlayColor,
        });
    },
);
