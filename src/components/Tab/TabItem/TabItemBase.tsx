import {FC, useCallback, useId} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextStyle, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater, useImmer} from 'use-immer';
import {HOOK} from '../../../hooks/hook';
import {OnEvent, OnStateChangeOptions} from '../../../hooks/useOnEvent';
import {EventName, State} from '../../Common/interface';
import {TabItemProps} from './TabItem';
import {useAnimated} from './useAnimated';

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

export interface TabItemBaseProps extends TabItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface ProcessEventOptions {
    setState: Updater<typeof initialState>;
}

export type ProcessPressOutOptions = Pick<RenderProps, 'activeKey' | 'indexKey' | 'onActive'> &
    ProcessEventOptions;

export type ProcessStateChangeOptions = OnStateChangeOptions & ProcessPressOutOptions;

export type ProcessLabelTextLayoutOptions = Pick<
    TabItemBaseProps,
    'onLabelTextLayout' | 'indexKey' | 'id'
>;

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processPressOut = ({activeKey, indexKey, onActive}: ProcessPressOutOptions) => {
    const responseActive = activeKey !== indexKey;

    if (responseActive) {
        onActive?.(indexKey);
    }
};

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

const initialState = {
    layout: {} as LayoutRectangle,
    eventName: 'none' as EventName,
};

export const TabItemBase: FC<TabItemBaseProps> = ({
    activeKey,
    defaultActiveKey,
    indexKey,
    onActive,
    onLabelTextLayout,
    render,
    ...renderProps
}) => {
    const [{layout, eventName}, setState] = useImmer(initialState);
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

    const [onEvent] = HOOK.useOnEvent({...renderProps, onStateChange});
    const [{color}] = useAnimated({active, defaultActive});

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
