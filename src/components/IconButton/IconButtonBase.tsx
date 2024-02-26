import {FC, useCallback, useEffect, useId} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextStyle, ViewStyle} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {EventName, State} from '../Common/interface';
import {IconButtonProps} from './IconButton';
import {useAnimated} from './useAnimated';
import {useBorder} from './useBorder';
import {useIcon} from './useIcon';
import {useUnderlayColor} from './useUnderlayColor';

export interface RenderProps extends IconButtonProps {
    onEvent: OnEvent;
    tooltipVisible: boolean;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height?: number;
        width?: number;
        layoutWidth?: number;
        layoutHeight?: number;
    };
    eventName: EventName;
}

export interface IconButtonBaseProps extends IconButtonProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface InitialState {
    eventName: EventName;
    layout: LayoutRectangle;
    tooltipVisible: boolean;
}

export interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

export type ProcessStateChangeOptions = OnStateChangeOptions &
    ProcessEventOptions & {
        supportingText?: string;
    };

export interface ProcessTooltipVisibleOptions extends ProcessEventOptions {
    eventName: EventName;
}

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processTooltipVisible = (
    {setState, eventName}: ProcessTooltipVisibleOptions,
    supportingText?: string,
) => {
    supportingText &&
        setState(draft => {
            draft.tooltipVisible = eventName === 'hoverIn';
        });
};

const processStateChange = ({
    event,
    eventName,
    setState,
    supportingText,
}: ProcessStateChangeOptions) => {
    eventName === 'layout'
        ? processLayout(event as LayoutChangeEvent, {setState})
        : processTooltipVisible({setState, eventName}, supportingText);

    setState(draft => {
        draft.eventName = eventName;
    });
};

const processDisabled = ({setState}: ProcessEventOptions, disabled?: boolean) =>
    disabled &&
    setState(draft => {
        draft.eventName = 'none';
    });

export const IconButtonBase: FC<IconButtonBaseProps> = ({
    disabled = false,
    fill,
    icon,
    render,
    tooltip,
    type = 'filled',
    renderStyle,
    ...renderProps
}) => {
    const [{eventName, layout, tooltipVisible}, setState] = useImmer<InitialState>({
        eventName: 'none',
        layout: {} as LayoutRectangle,
        tooltipVisible: false,
    });

    const id = useId();
    const [underlayColor] = useUnderlayColor({type});
    const onStateChange = useCallback(
        (_state: State, options = {} as OnStateChangeOptions) =>
            processStateChange({...options, setState, supportingText: tooltip?.supportingText}),
        [setState, tooltip?.supportingText],
    );

    const [onEvent] = useOnEvent({...renderProps, disabled, onStateChange});
    const [{backgroundColor, borderColor}] = useAnimated({disabled, type});
    const [iconElement] = useIcon({eventName, type, icon, disabled, fill});
    const [border] = useBorder({borderColor});

    useEffect(() => {
        processDisabled({setState}, disabled);
    }, [disabled, setState]);

    return render({
        ...renderProps,
        disabled,
        eventName,
        icon: iconElement,
        id,
        onEvent,
        tooltip,
        tooltipVisible,
        type,
        underlayColor,
        renderStyle: {
            ...renderStyle,
            ...border,
            backgroundColor,
            layoutHeight: layout?.height,
            layoutWidth: layout?.width,
        },
    });
};
