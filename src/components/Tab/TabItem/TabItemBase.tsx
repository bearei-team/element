import {FC, useCallback, useEffect, useId} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextStyle, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../../hooks/useOnEvent';
import {ComponentStatus, EventName, State} from '../../Common/interface';
import {TouchableRippleProps} from '../../TouchableRipple/TouchableRipple';
import {useAnimated} from './useAnimated';

export interface TabItemProps extends TouchableRippleProps {
    activeKey?: string;
    defaultActiveKey?: string;
    indexKey?: string;
    labelText?: string;
    onActive?: (key?: string) => void;
    onLabelTextLayout: (event: LayoutChangeEvent, key: string) => void;
}

export interface RenderProps extends TabItemProps {
    eventName: EventName;
    onEvent: OnEvent;
    onLabelTextLayout: (event: LayoutChangeEvent) => void;
    renderStyle: Animated.WithAnimatedObject<ViewStyle & TextStyle> & {
        height: number;
        width: number;
    };
    underlayColor: string;
}

interface TabItemBaseProps extends TabItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface InitialState {
    layout: LayoutRectangle;
    eventName: EventName;
    status: ComponentStatus;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessPressOutOptions = Pick<RenderProps, 'activeKey' | 'indexKey' | 'onActive'> &
    ProcessEventOptions;

type ProcessStateChangeOptions = OnStateChangeOptions & ProcessPressOutOptions;
type ProcessInitOptions = ProcessEventOptions & Pick<RenderProps, 'defaultActive'>;
type ProcessLabelTextLayoutOptions = Pick<
    TabItemBaseProps,
    'onLabelTextLayout' | 'indexKey' | 'id'
>;

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processPressOut = ({activeKey, indexKey, onActive}: ProcessPressOutOptions) =>
    activeKey !== indexKey && onActive?.(indexKey);

const processStateChange = ({
    event,
    eventName,
    activeKey,
    indexKey,
    setState,
    onActive,
}: ProcessStateChangeOptions) => {
    const nextEvent = {
        layout: () => processLayout(event as LayoutChangeEvent, {setState}),
        pressOut: () => processPressOut({activeKey, indexKey, setState, onActive}),
    };

    nextEvent[eventName as keyof typeof nextEvent]?.();

    setState(draft => {
        draft.eventName = eventName;
    });
};

const processLabelTextLayout = (
    event: LayoutChangeEvent,
    {onLabelTextLayout, indexKey, id}: ProcessLabelTextLayoutOptions,
) => onLabelTextLayout?.(event, (indexKey ?? id)!);

const processInit = ({setState}: ProcessInitOptions) =>
    setState(draft => {
        if (draft.status !== 'idle') {
            return;
        }

        draft.status = 'succeeded';
    });

export const TabItemBase: FC<TabItemBaseProps> = ({
    activeKey,
    defaultActiveKey,
    indexKey,
    onActive,
    onLabelTextLayout,
    render,
    ...renderProps
}) => {
    const [{layout, eventName, status}, setState] = useImmer<InitialState>({
        layout: {} as LayoutRectangle,
        eventName: 'none',
        status: 'idle',
    });

    const id = useId();
    const theme = useTheme();
    const active = typeof activeKey === 'string' ? activeKey === indexKey : undefined;
    const defaultActive =
        [typeof defaultActiveKey, typeof indexKey].includes('string') &&
        defaultActiveKey === indexKey;

    const underlayColor =
        active || defaultActive ? theme.palette.primary.primary : theme.palette.surface.onSurface;

    const onStateChange = useCallback(
        (_state: State, options = {} as OnStateChangeOptions) =>
            processStateChange({...options, activeKey, indexKey, setState, onActive}),
        [activeKey, indexKey, onActive, setState],
    );

    const onLabelLayout = useCallback(
        (event: LayoutChangeEvent) =>
            processLabelTextLayout(event, {indexKey, id, onLabelTextLayout}),
        [id, indexKey, onLabelTextLayout],
    );

    const [onEvent] = useOnEvent({...renderProps, onStateChange});
    const [{color}] = useAnimated({active, defaultActive, setState});

    useEffect(() => {
        processInit({defaultActive, setState});
    }, [defaultActive, setState]);

    if (status === 'idle') {
        return <></>;
    }

    return render({
        ...renderProps,
        eventName,
        id,
        onEvent,
        onLabelTextLayout: onLabelLayout,
        renderStyle: {color, height: layout.height, width: layout.width},
        underlayColor,
    });
};
