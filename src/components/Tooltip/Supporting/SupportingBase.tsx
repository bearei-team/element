import {FC, RefAttributes, useCallback, useEffect, useMemo} from 'react';
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
import {debounce} from '../../../utils/debounce.utils';
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
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessEmitOptions = Pick<InitialState, 'status'> & Pick<RenderProps, 'id'>;
type ProcessStateChangeOptions = OnStateChangeOptions &
    ProcessEventOptions &
    Pick<SupportingProps, 'onVisible'>;

type ProcessContainerLayoutOptions = ProcessEventOptions;

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
    ['hoverIn', 'hoverOut'].includes(eventName) && onVisible(eventName === 'hoverIn');
};

const processEmit = (supporting: React.JSX.Element, {id, status}: ProcessEmitOptions) =>
    status === 'succeeded' &&
    emitter.emit('modal', {id: `tooltip__supporting--${id}`, element: supporting});

const processContainerLayout = (
    containerCurrent: View | null,
    {setState}: ProcessContainerLayoutOptions,
) =>
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

export const SupportingBase: FC<SupportingBaseProps> = ({
    containerCurrent,
    id,
    onVisible,
    render,
    visible,
    ...renderProps
}) => {
    const [{containerLayout, layout, status}, setState] = useImmer<InitialState>({
        containerLayout: {} as InitialState['containerLayout'],
        layout: {} as LayoutRectangle,
        status: 'idle',
    });

    const [{opacity}] = useAnimated({visible});
    const debounceProcessContainerLayout = useMemo(() => debounce(processContainerLayout, 50), []);
    const onStateChange = useCallback(
        (_state: State, options = {} as OnStateChangeOptions) =>
            processStateChange({...options, setState, onVisible}),
        [onVisible, setState],
    );

    const [onEvent] = useOnEvent({...renderProps, onStateChange});
    const supporting = useMemo(
        () =>
            render({
                ...renderProps,
                containerLayout,
                id,
                onEvent,
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
        debounceProcessContainerLayout(containerCurrent, {setState});
    }, [containerCurrent, debounceProcessContainerLayout, setState]);

    useEffect(() => {
        processEmit(supporting, {id, status});
    }, [id, status, supporting]);

    return <></>;
};
