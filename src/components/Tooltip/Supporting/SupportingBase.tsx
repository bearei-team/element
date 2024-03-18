import {RefAttributes, forwardRef, useCallback, useEffect, useId, useMemo} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import {ViewProps} from 'react-native-svg/lib/typescript/fabric/utils';
import {Updater, useImmer} from 'use-immer';
import {emitter} from '../../../context/ModalProvider';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../../hooks/useOnEvent';
import {AnimatedInterpolation, ComponentStatus, State} from '../../Common/interface';
import {useAnimated} from './useAnimated';

type TooltipType = 'plain' | 'rich';
export interface SupportingProps extends Partial<ViewProps & RefAttributes<View>> {
    containerCurrent: View | null;
    onVisible: (value?: boolean) => void;
    supportingPosition?: 'horizontalStart' | 'horizontalEnd' | 'verticalStart' | 'verticalEnd';
    supportingText?: string;
    type?: TooltipType;
    visible?: boolean;
}

export interface RenderProps extends Omit<SupportingProps, 'containerCurrent' | 'onVisible'> {
    containerLayout: LayoutRectangle & {pageX: number; pageY: number};
    onEvent: OnEvent;
    closed?: boolean;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height?: number;
        opacity?: AnimatedInterpolation;
        width?: number;
    };
}

interface SupportingBaseProps extends SupportingProps {
    render: (props: RenderProps) => React.JSX.Element;
}

interface InitialState {
    containerLayout: LayoutRectangle & {pageX: number; pageY: number};
    layout: LayoutRectangle;
    status: ComponentStatus;
    closed?: boolean;
    visible?: boolean;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessEmitOptions = Pick<InitialState, 'status'> & Pick<RenderProps, 'id'>;
type ProcessStateChangeOptions = OnStateChangeOptions &
    ProcessEventOptions &
    Pick<SupportingProps, 'onVisible'>;

type ProcessContainerLayoutOptions = ProcessEventOptions & Pick<RenderProps, 'visible'>;

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        const update =
            draft.layout.width !== nativeEventLayout.width ||
            draft.layout.height !== nativeEventLayout.height;

        update && (draft.layout = nativeEventLayout);
    });
};

const processStateChange = ({event, eventName, setState, onVisible}: ProcessStateChangeOptions) => {
    eventName === 'layout' && processLayout(event as LayoutChangeEvent, {setState});
    ['hoverIn', 'hoverOut', 'pressIn'].includes(eventName) && onVisible(eventName === 'hoverIn');
};

const processEmit = (supporting: React.JSX.Element, {id, status}: ProcessEmitOptions) =>
    status === 'succeeded' &&
    emitter.emit('modal', {id: `tooltip__supporting--${id}`, element: supporting});

const processVisible = ({setState}: ProcessEventOptions, visible?: boolean) =>
    typeof visible === 'boolean' &&
    setState(draft => {
        visible && draft.closed !== !visible && (draft.closed = !visible);
    });

const processClosed = ({setState}: ProcessEventOptions, visible?: boolean) =>
    typeof visible === 'boolean' &&
    setState(draft => {
        draft.closed !== !visible && (draft.closed = !visible);
    });

const processContainerLayout = (
    {setState, visible}: ProcessContainerLayoutOptions,
    containerCurrent: View | null,
) =>
    visible &&
    containerCurrent?.measure((x, y, width, height, pageX, pageY) =>
        setState(draft => {
            const update =
                draft.containerLayout.pageX !== pageX || draft.containerLayout.pageY !== pageY;

            if (update) {
                draft.containerLayout = {
                    height,
                    pageX,
                    pageY,
                    width,
                    x,
                    y,
                };

                draft.status === 'idle' && (draft.status = 'succeeded');
            }
        }),
    );

export const SupportingBase = forwardRef<View, SupportingBaseProps>(
    ({containerCurrent, onVisible: onVisibleSource, render, visible, ...renderProps}, ref) => {
        const [{containerLayout, layout, status, closed}, setState] = useImmer<InitialState>({
            closed: true,
            containerLayout: {} as InitialState['containerLayout'],
            layout: {} as LayoutRectangle,
            status: 'idle',
        });

        const id = useId();
        const onVisible = useCallback(
            (value?: boolean) => processVisible({setState}, value),
            [setState],
        );

        const onClosed = useCallback(
            (value?: boolean) => processClosed({setState}, value),
            [setState],
        );

        const [{opacity}] = useAnimated({visible, onClosed});
        const onStateChange = useCallback(
            (_state: State, options = {} as OnStateChangeOptions) =>
                processStateChange({...options, setState, onVisible: onVisibleSource}),
            [onVisibleSource, setState],
        );

        const [onEvent] = useOnEvent({...renderProps, onStateChange});
        const supporting = useMemo(
            () =>
                render({
                    ...renderProps,
                    containerLayout,
                    id,
                    onEvent,
                    ref,
                    renderStyle: {opacity, width: layout.width, height: layout.height},
                    closed,
                }),
            [
                containerLayout,
                id,
                layout.height,
                layout.width,
                onEvent,
                opacity,
                ref,
                render,
                renderProps,
                closed,
            ],
        );

        useEffect(() => {
            processContainerLayout({setState, visible}, containerCurrent);
            onVisible(visible);
        }, [containerCurrent, onVisible, setState, visible]);

        useEffect(() => {
            processEmit(supporting, {id, status});
        }, [id, status, supporting]);

        return <></>;
    },
);
