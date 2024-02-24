import {FC, cloneElement, useCallback, useEffect, useId, useRef} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    ScaledSize,
    TextStyle,
    View,
    ViewStyle,
    useWindowDimensions,
} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {debounce} from '../../utils/debounce.utils';
import {ComponentStatus, EventName, State} from '../Common/interface';
import {TooltipProps} from './Tooltip';

export interface RenderProps extends TooltipProps {
    containerCurrent: View | null;
    onEvent: OnEvent;
    onVisible: (visible: boolean) => void;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height?: number;
        width?: number;
    };
    windowDimensions: ScaledSize;
}

export interface TooltipBaseProps extends TooltipProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface InitialState {
    eventName: EventName;
    layout: LayoutRectangle;
    visible: boolean;
    status: ComponentStatus;
}

export interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

export interface ProcessContainerLayout extends ProcessEventOptions {
    layout: LayoutRectangle;
}

export type ProcessStateChangeOptions = OnStateChangeOptions & ProcessEventOptions;

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processVisible = ({setState}: ProcessEventOptions, value?: boolean) => {
    typeof value === 'boolean' &&
        setState(draft => {
            draft.visible = value;
        });
};

const debounceProcessVisible = debounce(processVisible, 100);
const processStateChange = ({eventName, setState}: ProcessStateChangeOptions) => {
    ['hoverIn', 'hoverOut'].includes(eventName) &&
        debounceProcessVisible({setState}, eventName === 'hoverIn');

    setState(draft => {
        draft.eventName = eventName;
    });
};

export const TooltipBase: FC<TooltipBaseProps> = ({
    children,
    ref,
    render,
    visible: visibleSource = false,
    defaultVisible,
    ...renderProps
}) => {
    const [{layout, visible}, setState] = useImmer<InitialState>({
        eventName: 'none',
        layout: {} as LayoutRectangle,
        visible: false,
        status: 'idle',
    });

    const containerRef = useRef<View>(null);
    const id = useId();
    const relRef = (ref ?? containerRef) as React.RefObject<View>;
    const windowDimensions = useWindowDimensions();
    const onVisible = useCallback(
        (value?: boolean) => debounceProcessVisible({setState}, value),
        [setState],
    );

    const onStateChange = useCallback(
        (_state: State, options = {} as OnStateChangeOptions) =>
            processStateChange({...options, setState}),
        [setState],
    );

    const onLayout = useCallback(
        (event: LayoutChangeEvent) => processLayout(event, {setState}),
        [setState],
    );

    const [onEvent] = useOnEvent({...renderProps, onStateChange});

    useEffect(() => {
        onVisible(visibleSource);
    }, [onVisible, visibleSource]);

    useEffect(() => {
        onVisible(defaultVisible);
    }, [onVisible, defaultVisible]);

    return render({
        ...renderProps,
        children: cloneElement(children ?? <></>, {onLayout}),
        containerCurrent: relRef.current,
        defaultVisible,
        id,
        onEvent,
        onVisible,
        ref: relRef,
        renderStyle: {width: layout.width, height: layout.height},
        visible,
        windowDimensions,
    });
};
