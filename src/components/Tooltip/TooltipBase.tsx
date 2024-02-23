import {FC, RefObject, cloneElement, useCallback, useEffect, useId, useMemo, useRef} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    Text,
    TextStyle,
    View,
    ViewStyle,
    useWindowDimensions,
} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {emitter} from '../../context/ModalProvider';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {AnimatedInterpolation, ComponentStatus, EventName, State} from '../Common/interface';
import {TooltipProps} from './Tooltip';
import {Supporting, SupportingText} from './Tooltip.styles';
import {useAnimated} from './useAnimated';

export interface RenderProps extends TooltipProps {
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height?: number;
        opacity?: AnimatedInterpolation;
        width?: number;
    };
}

export interface TooltipBaseProps extends TooltipProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface InitialState {
    containerLayout: LayoutRectangle & {pageX: number; pageY: number};
    eventName: EventName;
    layout: LayoutRectangle;
    status: ComponentStatus;
    supportingLayout: LayoutRectangle;
    visible: boolean;
}

export interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

export interface ProcessEmitOptions extends Pick<RenderProps, 'visible'> {
    id: string;
    supporting: React.JSX.Element;
}

export interface ProcessContainerLayout extends ProcessEventOptions {
    layout: LayoutRectangle;
}

export type ProcessStateChangeOptions = OnStateChangeOptions &
    ProcessEventOptions & {
        onVisible: (visible: boolean) => void;
    };

export interface RenderSupportingOptions extends RenderProps {
    containerLayout: InitialState['containerLayout'];
    onSupportingLayout: (event: LayoutChangeEvent) => void;
    supportingLayout: LayoutRectangle;
}

const processContainerLayout = (
    containerRef: RefObject<View>,
    {setState, layout}: ProcessContainerLayout,
) =>
    typeof layout.width === 'number' &&
    containerRef.current?.measure((x, y, width, height, pageX, pageY) =>
        setState(draft => {
            draft.containerLayout = {x, y, width, height, pageX, pageY};
            draft.status = 'succeeded';
        }),
    );

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processSupportingLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.supportingLayout = nativeEventLayout;
    });
};

const processStateChange = ({eventName, setState, onVisible}: ProcessStateChangeOptions) => {
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

const processEmit = (status: ComponentStatus, {supporting, id}: ProcessEmitOptions) =>
    status === 'succeeded' && emitter.emit('modal', {id: `tooltip__${id}`, element: supporting});

const AnimatedSupporting = Animated.createAnimatedComponent(Supporting);
const renderSupporting = ({
    containerLayout,
    id,
    onSupportingLayout,
    renderStyle,
    supportingLayout,
    supportingPosition,
    supportingText,
    type,
    visible,
}: RenderSupportingOptions) => {
    const {opacity} = renderStyle;
    const {pageX, pageY, width: containerWidth, height: containerHeight} = containerLayout;
    const {width = 0, height = 0} = supportingLayout;

    return (
        <AnimatedSupporting
            containerHeight={containerHeight}
            containerWidth={containerWidth}
            onLayout={onSupportingLayout}
            pageX={pageX}
            pageY={pageY}
            renderedHeight={height}
            renderedWidth={width}
            shape="extraSmall"
            supportingPosition={supportingPosition}
            testID={`tooltip__supporting--${id}`}
            type={type}
            visible={visible}
            style={{
                opacity,
                transform: supportingPosition?.startsWith('vertical')
                    ? [{translateX: -(width / 2)}]
                    : [{translateY: -(height / 2)}],
            }}>
            <SupportingText
                ellipsizeMode="tail"
                numberOfLines={1}
                size="small"
                testID={`tooltip__supportingText--${id}`}
                type="body">
                {supportingText}
            </SupportingText>
        </AnimatedSupporting>
    );
};

export const TooltipBase: FC<TooltipBaseProps> = ({
    children,
    ref,
    render,
    supportingPosition,
    supportingText,
    type = 'plain',
    visible: visibleSource = false,
    ...renderProps
}) => {
    const [{visible, layout, status, containerLayout, supportingLayout}, setState] =
        useImmer<InitialState>({
            containerLayout: {} as InitialState['containerLayout'],
            eventName: 'none',
            layout: {} as LayoutRectangle,
            status: 'idle',
            supportingLayout: {} as LayoutRectangle,
            visible: false,
        });

    const containerRef = useRef<View>(null);
    const relRef = ref ?? containerRef;
    const id = useId();
    const windowDimensions = useWindowDimensions();
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

    const onSupportingLayout = useCallback(
        (event: LayoutChangeEvent) => processSupportingLayout(event, {setState}),
        [setState],
    );

    const [onEvent] = useOnEvent({...renderProps, onStateChange});
    const [{opacity}] = useAnimated({visible});
    const supporting = useMemo(
        () =>
            renderSupporting({
                containerLayout,
                id,
                onEvent,
                onSupportingLayout,
                renderStyle: {opacity},
                supportingLayout,
                supportingPosition,
                supportingText,
                type,
                visible,
            }),
        [
            containerLayout,
            id,
            onEvent,
            onSupportingLayout,
            opacity,
            supportingLayout,
            supportingPosition,
            supportingText,
            type,
            visible,
        ],
    );

    useEffect(() => {
        onVisible(visibleSource);
    }, [onVisible, visibleSource]);

    useEffect(() => {
        processContainerLayout(containerRef, {setState, layout});
    }, [setState, layout, windowDimensions]);

    useEffect(() => {
        processEmit(status, {id, supporting});
    }, [id, status, supporting]);

    return render({
        ...renderProps,
        children: cloneElement(children ?? <></>, {onLayout}),
        id,
        onEvent,
        ref: relRef,
        renderStyle: {width: layout.width, height: layout.height},
        type,
        visible,
    });
};

export const Tooltip: FC<TooltipBaseProps> = () => {
    const windowDimensions = useWindowDimensions();

    return (
        <View>
            <Text>{windowDimensions.width}</Text>
        </View>
    );
};
