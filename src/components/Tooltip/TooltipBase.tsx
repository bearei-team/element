import {FC, RefAttributes, cloneElement, useCallback, useEffect, useId, useRef} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    TextStyle,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {debounce} from '../../utils/debounce.utils';
import {State} from '../Common/interface';
import {SupportingProps} from './Supporting/Supporting';

type BaseProps = Partial<
    ViewProps &
        RefAttributes<View> &
        Pick<
            SupportingProps,
            'supportingPosition' | 'supportingText' | 'type' | 'visible' | 'onVisible'
        >
>;

export interface TooltipProps extends BaseProps {
    children?: React.JSX.Element;
    defaultVisible?: boolean;
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

type ProcessStateChangeOptions = OnStateChangeOptions & ProcessEventOptions;
type ProcessVisibleOptions = ProcessEventOptions & Pick<RenderProps, 'onVisible'>;

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processVisible = ({setState, onVisible}: ProcessVisibleOptions, visible?: boolean) => {
    typeof visible === 'boolean' &&
        setState(draft => {
            if (draft.visible === visible) {
                return;
            }

            draft.visible = visible;

            onVisible?.(visible);
        });
};

const debounceProcessVisible = debounce(processVisible, 100);
const processStateChange = ({eventName, setState}: ProcessStateChangeOptions) => {
    ['hoverIn', 'hoverOut'].includes(eventName) &&
        debounceProcessVisible({setState}, eventName === 'hoverIn');
};

export const TooltipBase: FC<TooltipBaseProps> = ({
    children,
    defaultVisible,
    onVisible: onVisibleSource,
    ref,
    render,
    visible: visibleSource,
    ...renderProps
}) => {
    const [{layout, visible}, setState] = useImmer<InitialState>({
        layout: {} as LayoutRectangle,
        visible: undefined,
    });

    const containerRef = useRef<View>(null);
    const id = useId();
    const relRef = (ref ?? containerRef) as React.RefObject<View>;
    const onVisible = useCallback(
        (value?: boolean) => debounceProcessVisible({setState, onVisible: onVisibleSource}, value),
        [onVisibleSource, setState],
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
        onVisible(visibleSource ?? defaultVisible);
    }, [onVisible, visibleSource, defaultVisible]);

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
    });
};
