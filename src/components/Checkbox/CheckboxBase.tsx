import {FC, useCallback, useEffect, useId} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextStyle, ViewStyle} from 'react-native';
import {useImmer} from 'use-immer';
import {HOOK} from '../../hooks/hook';
import {OnEvent, OnStateChangeOptions} from '../../hooks/useOnEvent';
import {ComponentStatus, EventName, State} from '../Common/interface';
import {CheckboxProps, CheckboxType} from './Checkbox';

import {useTheme} from 'styled-components/native';
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

const initialState = {
    active: undefined as boolean | undefined,
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
    status: 'idle' as ComponentStatus,
    type: 'unselected' as CheckboxType,
};

export const CheckboxBase: FC<CheckboxBaseProps> = props => {
    const {
        defaultActive,
        disabled = false,
        error,
        indeterminate,
        onActive,
        render,
        ...renderProps
    } = props;

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

    const processLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const nativeEventLayout = event.nativeEvent.layout;

            setState(draft => {
                draft.layout = nativeEventLayout;
            });
        },
        [setState],
    );

    const processPressOut = useCallback(() => {
        const nextActive = !active;
        const activeType = indeterminate ? 'indeterminate' : 'selected';

        setState(draft => {
            draft.active = nextActive;
            draft.type = nextActive ? activeType : 'unselected';
        });

        onActive?.(nextActive);
    }, [active, indeterminate, onActive, setState]);

    const processStateChange = useCallback(
        (_nextState: State, options = {} as OnStateChangeOptions) => {
            const {event, eventName: nextEventName} = options;
            const nextEvent = {
                layout: () => {
                    processLayout(event as LayoutChangeEvent);
                },
                pressOut: () => {
                    processPressOut();
                },
            };

            nextEvent[nextEventName as keyof typeof nextEvent]?.();

            setState(draft => {
                draft.eventName = nextEventName;
            });
        },
        [processLayout, processPressOut, setState],
    );

    const [onEvent] = HOOK.useOnEvent({
        ...props,
        disabled,
        onStateChange: processStateChange,
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
