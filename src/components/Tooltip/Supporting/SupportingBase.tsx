import {FC, useCallback, useEffect, useId, useMemo} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {emitter} from '../../../context/ModalProvider';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../../hooks/useOnEvent';
import {AnimatedInterpolation, ComponentStatus, EventName, State} from '../../Common/interface';
import {SupportingProps} from './Supporting';
import {useAnimated} from './useAnimated';

export interface RenderProps
    extends Omit<SupportingProps, 'containerCurrent' | 'windowDimensions' | 'onVisible'> {
    containerLayout: LayoutRectangle & {pageX: number; pageY: number};
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height?: number;
        opacity?: AnimatedInterpolation;
        width?: number;
    };
}

export interface SupportingBaseProps extends SupportingProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface InitialState {
    containerLayout: LayoutRectangle & {pageX: number; pageY: number};
    eventName: EventName;
    layout: LayoutRectangle;
    status: ComponentStatus;
}

export interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

export interface ProcessEmitOptions extends Pick<RenderProps, 'visible'> {
    id: string;
    supporting: React.JSX.Element;
}

export type ProcessStateChangeOptions = OnStateChangeOptions &
    ProcessEventOptions &
    Pick<SupportingProps, 'onVisible'>;

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processStateChange = ({event, eventName, setState, onVisible}: ProcessStateChangeOptions) => {
    eventName === 'layout' && processLayout(event as LayoutChangeEvent, {setState});
    ['hoverIn', 'hoverOut'].includes(eventName) && onVisible(eventName === 'hoverIn');

    setState(draft => {
        draft.eventName = eventName;
    });
};

const processEmit = (status: ComponentStatus, {supporting, id}: ProcessEmitOptions) =>
    status === 'succeeded' &&
    emitter.emit('modal', {id: `tooltip__supporting--${id}`, element: supporting});

const processContainerLayout = (containerCurrent: View | null, {setState}: ProcessEventOptions) =>
    containerCurrent?.measure((x, y, width, height, pageX, pageY) =>
        setState(draft => {
            draft.containerLayout = {
                height,
                pageX,
                pageY,
                width,
                x,
                y,
            };

            draft.status = 'succeeded';
        }),
    );

export const SupportingBase: FC<SupportingBaseProps> = ({
    containerCurrent,
    render,
    visible,
    windowDimensions,
    onVisible,
    defaultVisible,
    ...renderProps
}) => {
    const [{status, containerLayout, layout}, setState] = useImmer<InitialState>({
        containerLayout: {} as InitialState['containerLayout'],
        eventName: 'none',
        layout: {} as LayoutRectangle,
        status: 'idle',
    });

    const id = useId();
    const onContainerLayout = useCallback(
        () => processContainerLayout(containerCurrent, {setState}),
        [containerCurrent, setState],
    );

    const onStateChange = useCallback(
        (_state: State, options = {} as OnStateChangeOptions) =>
            processStateChange({...options, setState, onVisible}),
        [onVisible, setState],
    );

    const [onEvent] = useOnEvent({...renderProps, onStateChange});
    const [{opacity}] = useAnimated({visible, defaultVisible});
    const supporting = useMemo(
        () =>
            render({
                id,
                ...renderProps,
                onEvent,
                containerLayout,
                renderStyle: {opacity, width: layout.width, height: layout.height},
                visible,
            }),
        [
            containerLayout,
            id,
            layout.height,
            layout.width,
            onEvent,
            opacity,
            render,
            renderProps,
            visible,
        ],
    );

    useEffect(() => {
        onContainerLayout();
    }, [onContainerLayout, windowDimensions]);

    useEffect(() => {
        processEmit(status, {id, supporting});
    }, [id, status, supporting]);

    return <></>;
};
