import {FC, useCallback, useEffect, useId} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextStyle, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {ComponentStatus, EventName, State} from '../Common/interface';
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {useIcon} from './useIcon';

type CheckboxType = 'selected' | 'indeterminate' | 'unselected';
export interface CheckboxProps extends TouchableRippleProps {
    active?: boolean;
    defaultActive?: boolean;
    disabled?: boolean;
    error?: boolean;
    indeterminate?: boolean;
    onActive?: (value?: boolean) => void;
    type?: CheckboxType;
}

export interface RenderProps extends CheckboxProps {
    eventName: EventName;
    icon: React.JSX.Element;
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height: number;
        width: number;
    };
}

interface CheckboxBaseProps extends CheckboxProps {
    render: (props: RenderProps) => React.JSX.Element;
}

interface InitialState {
    active?: boolean;
    eventName: EventName;
    layout: LayoutRectangle;
    status: ComponentStatus;
    type?: CheckboxType;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessActiveOptions = Pick<RenderProps, 'active' | 'indeterminate' | 'onActive'> &
    ProcessEventOptions;

type ProcessStateChangeOptions = OnStateChangeOptions & ProcessActiveOptions;
type ProcessInitOptions = Pick<RenderProps, 'indeterminate'> & ProcessEventOptions;

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processActive = ({setState, active, indeterminate, onActive}: ProcessActiveOptions) =>
    typeof active === 'boolean' &&
    setState(draft => {
        if (draft.active === active) {
            return;
        }

        const activeType = indeterminate ? 'indeterminate' : 'selected';

        draft.active = active;
        draft.type = active ? activeType : 'unselected';

        onActive?.(active);
    });

const processStateChange = ({
    active,
    event,
    eventName,
    indeterminate,
    onActive,
    setState,
}: ProcessStateChangeOptions) => {
    const nextEvent = {
        layout: () => processLayout(event as LayoutChangeEvent, {setState}),
        pressOut: () => processActive({setState, onActive, active: !active, indeterminate}),
    } as Record<EventName, () => void>;

    nextEvent[eventName]?.();

    setState(draft => {
        draft.eventName = eventName;
    });
};

const processInit = ({indeterminate, setState}: ProcessInitOptions) =>
    setState(draft => {
        if (draft.status !== 'idle') {
            return;
        }

        if (typeof draft.active === 'boolean') {
            const defaultType = draft.active ? 'selected' : 'unselected';

            draft.type = indeterminate ? 'indeterminate' : defaultType;
        }

        draft.status = 'succeeded';
    });

const processIndeterminate = ({setState}: ProcessEventOptions, indeterminate?: boolean) =>
    typeof indeterminate === 'boolean' &&
    setState(draft => {
        if (indeterminate) {
            draft.active = indeterminate;
            draft.type = 'indeterminate';

            return;
        }

        draft.type = draft.active ? 'selected' : 'unselected';
    });

export const CheckboxBase: FC<CheckboxBaseProps> = ({
    active: activeSource,
    defaultActive,
    disabled,
    error,
    indeterminate,
    onActive,
    render,
    ...renderProps
}) => {
    const [{active, eventName, layout, status, type}, setState] = useImmer<InitialState>({
        active: undefined,
        eventName: 'none',
        layout: {} as LayoutRectangle,
        status: 'idle',
        type: 'unselected',
    });

    const id = useId();
    const theme = useTheme();
    const checkUnderlayColor =
        type === 'unselected'
            ? theme.palette.surface.onSurfaceVariant
            : theme.palette.primary.primary;

    const underlayColor = error ? theme.palette.error.error : checkUnderlayColor;
    const [icon] = useIcon({disabled, error, eventName, type});
    const onStateChange = useCallback(
        (_state: State, options = {} as OnStateChangeOptions) =>
            processStateChange({...options, active, indeterminate, onActive, setState}),
        [active, indeterminate, onActive, setState],
    );

    const [onEvent] = useOnEvent({...renderProps, disabled, onStateChange});

    useEffect(() => {
        processActive({active: activeSource ?? defaultActive, indeterminate, setState, onActive});
    }, [activeSource, defaultActive, indeterminate, onActive, setState]);

    useEffect(() => {
        processIndeterminate({setState}, indeterminate);
    }, [indeterminate, setState]);

    useEffect(() => {
        processInit({indeterminate, setState});
    }, [activeSource, defaultActive, indeterminate, setState]);

    if (status === 'idle') {
        return <></>;
    }

    return render({
        ...renderProps,
        disabled,
        eventName,
        icon,
        id,
        onEvent,
        renderStyle: {height: layout.height, width: layout.width},
        underlayColor,
    });
};
