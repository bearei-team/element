import {FC, useEffect, useId, useMemo} from 'react';
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
    setState?: Updater<typeof initialState>;
}

export type ProcessPressOutOptions = Partial<
    Pick<RenderProps, 'active' | 'indeterminate' | 'onActive'> & ProcessEventOptions
>;

export type ProcessStateChangeOptions = ProcessPressOutOptions;

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState?.(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processPressOut = ({setState, active, indeterminate, onActive}: ProcessPressOutOptions) => {
    const nextActive = !active;
    const activeType = indeterminate ? 'indeterminate' : 'selected';

    setState?.(draft => {
        draft.active = nextActive;
        draft.type = nextActive ? activeType : 'unselected';
    });

    onActive?.(nextActive);
};

const processStateChange =
    ({setState, onActive, active, indeterminate}: ProcessStateChangeOptions) =>
    (_state: State, {event, eventName} = {} as OnStateChangeOptions) => {
        const nextEvent = {
            layout: () => processLayout(event as LayoutChangeEvent, {setState}),
            pressOut: () => processPressOut({setState, onActive, active, indeterminate}),
        };

        nextEvent[eventName as keyof typeof nextEvent]?.();

        setState?.(draft => {
            draft.eventName = eventName;
        });
    };

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
    const [icon] = useIcon({
        disabled,
        error,
        eventName,
        type,
    });

    const onStateChange = useMemo(
        () => processStateChange({active, indeterminate, onActive, setState}),
        [active, indeterminate, onActive, setState],
    );

    const [onEvent] = HOOK.useOnEvent({
        ...renderProps,
        disabled,
        onStateChange,
    });

    useEffect(() => {
        if (status === 'idle') {
            setState(draft => {
                if (typeof defaultActive === 'boolean') {
                    const defaultType = defaultActive ? 'selected' : 'unselected';

                    draft.active = defaultActive;
                    draft.type = indeterminate ? 'indeterminate' : defaultType;
                }

                draft.status = 'succeeded';
            });
        }
    }, [defaultActive, indeterminate, setState, status]);

    useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            setState(draft => {
                if (indeterminate) {
                    draft.active = true;
                    draft.type = 'indeterminate';

                    return;
                }

                draft.type = draft.active ? 'selected' : 'unselected';
            });
        }
    }, [indeterminate, setState]);

    if (status === 'idle') {
        return <></>;
    }

    return render({
        ...renderProps,
        eventName,
        icon,
        id,
        onEvent,
        renderStyle: {height: layout.height, width: layout.width},
        underlayColor,
    });
};
