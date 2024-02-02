import {FC, useCallback, useEffect, useId} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextStyle, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater, useImmer} from 'use-immer';
import {HOOK} from '../../hooks/hook';
import {OnEvent, OnStateChangeOptions} from '../../hooks/useOnEvent';
import {ComponentStatus, EventName, State} from '../Common/interface';
import {CheckboxProps, CheckboxType} from './Checkbox';
import {useIcon} from './useIcon';

export interface RenderProps extends CheckboxProps {
    eventName: EventName;
    icon: React.JSX.Element;
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height: number;
        width: number;
    };
}

export interface CheckboxBaseProps extends CheckboxProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface ProcessEventOptions {
    setState: Updater<typeof initialState>;
}

export type ProcessPressOutOptions = Pick<RenderProps, 'active' | 'indeterminate' | 'onActive'> &
    ProcessEventOptions;

export type ProcessStateChangeOptions = OnStateChangeOptions & ProcessPressOutOptions;
export type ProcessDefaultActiveOptions = Pick<RenderProps, 'defaultActive' | 'indeterminate'> &
    ProcessEventOptions;

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processPressOut = ({setState, active, indeterminate, onActive}: ProcessPressOutOptions) => {
    const nextActive = !active;
    const activeType = indeterminate ? 'indeterminate' : 'selected';

    setState(draft => {
        draft.active = nextActive;
        draft.type = nextActive ? activeType : 'unselected';
    });

    onActive?.(nextActive);
};

const processStateChange = ({
    event,
    eventName,
    setState,
    onActive,
    active,
    indeterminate,
}: ProcessStateChangeOptions) => {
    const nextEvent = {
        layout: () => processLayout(event as LayoutChangeEvent, {setState}),
        pressOut: () => processPressOut({setState, onActive, active, indeterminate}),
    };

    nextEvent[eventName as keyof typeof nextEvent]?.();

    setState(draft => {
        draft.eventName = eventName;
    });
};

const processDefaultActive = (
    status: ComponentStatus,
    {defaultActive, indeterminate, setState}: ProcessDefaultActiveOptions,
) =>
    status === 'idle' &&
    setState(draft => {
        if (typeof defaultActive === 'boolean') {
            const defaultType = defaultActive ? 'selected' : 'unselected';

            draft.active = defaultActive;
            draft.type = indeterminate ? 'indeterminate' : defaultType;
        }

        draft.status = 'succeeded';
    });

const processIndeterminate = ({setState}: ProcessEventOptions, indeterminate?: boolean) =>
    typeof indeterminate === 'boolean' &&
    setState(draft => {
        if (indeterminate) {
            draft.active = true;
            draft.type = 'indeterminate';

            return;
        }

        draft.type = draft.active ? 'selected' : 'unselected';
    });

const initialState = {
    active: undefined as boolean | undefined,
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
    status: 'idle' as ComponentStatus,
    type: 'unselected' as CheckboxType,
};

export const CheckboxBase: FC<CheckboxBaseProps> = ({
    defaultActive,
    disabled = false,
    error,
    indeterminate,
    onActive,
    render,
    ...renderProps
}) => {
    const [{active, eventName, layout, status, type}, setState] = useImmer(initialState);
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

    const [onEvent] = HOOK.useOnEvent({...renderProps, disabled, onStateChange});

    useEffect(() => {
        processDefaultActive(status, {defaultActive, indeterminate, setState});
    }, [defaultActive, indeterminate, setState, status]);

    useEffect(() => {
        processIndeterminate({setState}, indeterminate);
    }, [indeterminate, setState]);

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
