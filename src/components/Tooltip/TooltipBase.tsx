import {FC, cloneElement, useCallback, useEffect, useId} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextStyle, ViewStyle} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {AnimatedInterpolation, EventName, State} from '../Common/interface';
import {TooltipProps} from './Tooltip';
import {useAnimated} from './useAnimated';

export interface RenderProps extends TooltipProps {
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height: number;
        opacity: AnimatedInterpolation;
        supportingHeight: number;
        supportingWidth: number;
        width: number;
    };
}

export interface TooltipBaseProps extends TooltipProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface InitialState {
    eventName: EventName;
    layout: LayoutRectangle;
    supportingLayout: LayoutRectangle;
    visible: boolean;
}

export interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

export type ProcessStateChangeOptions = OnStateChangeOptions &
    ProcessEventOptions & {
        onVisible: (visible: boolean) => void;
    };

const processSupportingLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.supportingLayout = nativeEventLayout;
    });
};

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processStateChange = ({event, eventName, setState, onVisible}: ProcessStateChangeOptions) => {
    eventName === 'layout' && processSupportingLayout(event as LayoutChangeEvent, {setState});

    ['hoverIn', 'hoverOut'].includes(eventName) && onVisible(eventName === 'hoverIn');

    setState(draft => {
        draft.eventName = eventName;
    });
};

const processVisible = (value: boolean, {setState}: ProcessEventOptions) => {
    setState(draft => {
        draft.visible = value;
    });
};

export const TooltipBase: FC<TooltipBaseProps> = ({
    render,
    type = 'plain',
    visible: visibleSource = false,
    children,
    ...renderProps
}) => {
    const [{supportingLayout, visible, layout}, setState] = useImmer<InitialState>({
        eventName: 'none',
        layout: {} as LayoutRectangle,
        supportingLayout: {} as LayoutRectangle,
        visible: false,
    });

    const id = useId();
    const onVisible = useCallback(
        (value: boolean) => processVisible(value, {setState}),
        [setState],
    );

    const onStateChange = useCallback(
        (_state: State, options = {} as OnStateChangeOptions) =>
            processStateChange({...options, setState, onVisible}),
        [onVisible, setState],
    );

    const onLayout = useCallback(
        (event: LayoutChangeEvent) => processLayout(event, {setState}),
        [setState],
    );

    const [onEvent] = useOnEvent({...renderProps, onStateChange});
    const [{opacity}] = useAnimated({visible});

    useEffect(() => {
        onVisible(visibleSource);
    }, [onVisible, visibleSource]);

    return render({
        ...renderProps,
        id,
        onEvent,
        type,
        children: cloneElement(children ?? <></>, {onLayout}),
        renderStyle: {
            height: layout.height,
            opacity,
            supportingHeight: supportingLayout?.height,
            supportingWidth: supportingLayout?.width,
            width: layout.width,
        },
    });
};
