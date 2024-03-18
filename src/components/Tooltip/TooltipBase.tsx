import {
    RefAttributes,
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    PressableProps,
    TextStyle,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {emitter} from '../../context/ModalProvider';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {debounce} from '../../utils/debounce.utils';
import {ShapeProps} from '../Common/Common.styles';
import {EventName, State} from '../Common/interface';
import {SupportingProps} from './Supporting/Supporting';

type BaseProps = Partial<
    Pick<
        SupportingProps,
        'supportingPosition' | 'supportingText' | 'type' | 'visible' | 'onVisible'
    > &
        Pick<ShapeProps, 'shape'> &
        PressableProps &
        RefAttributes<View> &
        ViewProps
>;

export interface TooltipProps extends Omit<BaseProps, 'children' | 'disabled' | 'hitSlop'> {
    children?: React.JSX.Element;
    defaultVisible?: boolean;
    disabled?: boolean;
    eventName?: EventName;
}

export interface RenderProps extends TooltipProps {
    containerCurrent: View | null;
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height?: number;
        width?: number;
    };
}

interface TooltipBaseProps extends TooltipProps {
    render: (props: RenderProps) => React.JSX.Element;
}

interface InitialState {
    layout: LayoutRectangle;
    visible?: boolean;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessStateChangeOptions = OnStateChangeOptions &
    ProcessEventOptions & {debounceProcessVisible: typeof processVisible};

type ProcessEventNameChangeOptions = Pick<
    ProcessStateChangeOptions,
    'setState' | 'debounceProcessVisible'
>;

type ProcessVisibleOptions = ProcessEventOptions & Pick<RenderProps, 'onVisible'>;

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        const update =
            draft.layout.width !== nativeEventLayout.width ||
            draft.layout.height !== nativeEventLayout.height;

        update && (draft.layout = nativeEventLayout);
    });
};

const processVisible = ({setState, onVisible}: ProcessVisibleOptions, visible?: boolean) => {
    if (typeof visible !== 'boolean') {
        return;
    }

    setState(draft => {
        if (draft.visible === visible) {
            return;
        }

        draft.visible = visible;
    });

    onVisible?.(visible);
};

const processEventNameChange = (
    {setState, debounceProcessVisible}: ProcessEventNameChangeOptions,
    eventName?: EventName,
) =>
    eventName &&
    ['hoverIn', 'hoverOut', 'pressIn'].includes(eventName) &&
    debounceProcessVisible({setState}, eventName === 'hoverIn');

const processStateChange = ({
    event,
    eventName,
    setState,
    debounceProcessVisible,
}: ProcessStateChangeOptions) => {
    eventName === 'layout' && processLayout(event as LayoutChangeEvent, {setState});

    processEventNameChange({setState, debounceProcessVisible}, eventName);
};

const processUnmount = (id: string) =>
    emitter.emit('modal', {id: `tooltip__supporting--${id}`, element: undefined});

export const TooltipBase = forwardRef<View, TooltipBaseProps>(
    (
        {
            defaultVisible,
            onVisible: onVisibleSource,
            render,
            visible: visibleSource,
            disabled = false,
            eventName: eventNameSource,
            ...renderProps
        },
        ref,
    ) => {
        const [{layout, visible}, setState] = useImmer<InitialState>({
            layout: {} as LayoutRectangle,
            visible: undefined,
        });

        const containerRef = useRef<View>(null);
        const id = useId();
        const debounceProcessVisible = useMemo(() => debounce(processVisible, 100), []);
        const onVisible = useCallback(
            (value?: boolean) =>
                debounceProcessVisible({setState, onVisible: onVisibleSource}, value),
            [debounceProcessVisible, onVisibleSource, setState],
        );

        const onStateChange = useCallback(
            (_state: State, options = {} as OnStateChangeOptions) =>
                processStateChange({...options, setState, debounceProcessVisible}),
            [debounceProcessVisible, setState],
        );

        const onEventNameChange = useCallback(
            (eventName?: EventName) =>
                processEventNameChange({setState, debounceProcessVisible}, eventName),
            [debounceProcessVisible, setState],
        );

        const [onEvent] = useOnEvent({
            ...renderProps,
            onStateChange,
            disabled: typeof eventNameSource === 'string' ? true : disabled,
        });

        useImperativeHandle(
            ref,
            () => (containerRef?.current ? containerRef?.current : {}) as View,
            [],
        );

        useEffect(() => {
            onVisible(visibleSource ?? defaultVisible);
        }, [onVisible, visibleSource, defaultVisible]);

        useEffect(() => {
            onEventNameChange(eventNameSource);

            return () => {
                processUnmount(id);
            };
        }, [eventNameSource, id, onEventNameChange]);

        return render({
            ...renderProps,
            containerCurrent: containerRef.current,
            id,
            onEvent,
            onVisible,
            ref: containerRef,
            renderStyle: {width: layout.width, height: layout.height},
            visible,
        });
    },
);
