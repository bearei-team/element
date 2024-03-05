import {FC, RefAttributes, useCallback, useEffect, useId, useMemo, useRef} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    PressableProps,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {emitter} from '../../context/ModalProvider';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {debounce} from '../../utils/debounce.utils';
import {State} from '../Common/interface';
import {SupportingProps} from './Supporting/Supporting';

type BaseProps = Partial<
    Pick<
        SupportingProps,
        'supportingPosition' | 'supportingText' | 'type' | 'visible' | 'onVisible'
    > &
        RefAttributes<View> &
        PressableProps
>;

export interface TooltipProps extends Omit<BaseProps, 'children' | 'disabled' | 'hitSlop'> {
    children?: React.JSX.Element;
    defaultVisible?: boolean;
    disabled?: boolean;
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

const processStateChange = ({
    event,
    eventName,
    setState,
    debounceProcessVisible,
}: ProcessStateChangeOptions) => {
    eventName === 'layout' && processLayout(event as LayoutChangeEvent, {setState});
    ['hoverIn', 'hoverOut'].includes(eventName) &&
        debounceProcessVisible({setState}, eventName === 'hoverIn');
};

const processUnmount = (id: string) =>
    emitter.emit('modal', {id: `tooltip__supporting--${id}`, element: undefined});

export const TooltipBase: FC<TooltipBaseProps> = ({
    defaultVisible,
    onVisible: onVisibleSource,
    ref: refSource,
    render,
    visible: visibleSource,
    disabled = false,
    ...renderProps
}) => {
    const [{layout, visible}, setState] = useImmer<InitialState>({
        layout: {} as LayoutRectangle,
        visible: undefined,
    });

    const containerRef = useRef<View>(null);
    const id = useId();
    const ref = (refSource ?? containerRef) as React.RefObject<View>;
    const debounceProcessVisible = useMemo(() => debounce(processVisible, 50), []);
    const onVisible = useCallback(
        (value?: boolean) => debounceProcessVisible({setState, onVisible: onVisibleSource}, value),
        [debounceProcessVisible, onVisibleSource, setState],
    );

    const onStateChange = useCallback(
        (_state: State, options = {} as OnStateChangeOptions) =>
            processStateChange({...options, setState, debounceProcessVisible}),
        [debounceProcessVisible, setState],
    );

    const [onEvent] = useOnEvent({...renderProps, onStateChange, disabled});

    useEffect(() => {
        onVisible(visibleSource ?? defaultVisible);
    }, [onVisible, visibleSource, defaultVisible]);

    useEffect(() => {
        return () => processUnmount(id);
    }, [id]);

    return render({
        ...renderProps,
        containerCurrent: ref.current,
        id,
        onEvent,
        onVisible,
        ref,
        renderStyle: {width: layout.width, height: layout.height},
        visible,
    });
};
