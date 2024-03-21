import {forwardRef, useCallback, useEffect, useId} from 'react';
import {View} from 'react-native';
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
}

interface CheckboxBaseProps extends CheckboxProps {
    render: (props: RenderProps) => React.JSX.Element;
}

interface InitialState {
    active?: boolean;
    eventName: EventName;
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

const processActive = ({setState, active, indeterminate, onActive}: ProcessActiveOptions) => {
    if (typeof active !== 'boolean') {
        return;
    }

    setState(draft => {
        if (draft.active === active) {
            return;
        }

        const activeType = indeterminate ? 'indeterminate' : 'selected';

        draft.active = active;
        draft.type = active ? activeType : 'unselected';
    });

    onActive?.(active);
};

const processStateChange = ({
    active,
    eventName,
    indeterminate,
    onActive,
    setState,
}: ProcessStateChangeOptions) => {
    const nextEvent = {
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

export const CheckboxBase = forwardRef<View, CheckboxBaseProps>(
    (
        {
            active: activeSource,
            defaultActive,
            disabled,
            error,
            indeterminate,
            onActive,
            render,
            ...renderProps
        },
        ref,
    ) => {
        const [{active, eventName, status, type}, setState] = useImmer<InitialState>({
            active: undefined,
            eventName: 'none',
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
            processInit({indeterminate, setState});
            processIndeterminate({setState}, indeterminate);
            processActive({
                active: activeSource ?? defaultActive,
                indeterminate,
                setState,
                onActive,
            });
        }, [activeSource, defaultActive, indeterminate, onActive, setState]);

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
            ref,
            underlayColor,
        });
    },
);
