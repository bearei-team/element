import {FC, useId, useMemo} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextStyle, ViewStyle} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {HOOK} from '../../hooks/hook';
import {OnEvent, OnStateChangeOptions} from '../../hooks/useOnEvent';
import {EventName, State} from '../Common/interface';
import {IconButtonProps} from './IconButton';
import {useAnimated} from './useAnimated';
import {useBorder} from './useBorder';
import {useIcon} from './useIcon';
import {useUnderlayColor} from './useUnderlayColor';

export interface RenderProps extends IconButtonProps {
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height: number;
        width: number;
    };
    eventName: EventName;
}

export interface IconButtonBaseProps extends IconButtonProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface ProcessOptions {
    setState?: Updater<typeof initialState>;
}

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState?.(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processStateChange =
    ({setState}: ProcessOptions) =>
    (_nextState: State, options = {} as OnStateChangeOptions) => {
        const {event, eventName: nextEventName} = options;

        if (nextEventName === 'layout') {
            processLayout(event as LayoutChangeEvent, {setState});
        }

        setState?.(draft => {
            draft.eventName = nextEventName;
        });
    };

const initialState = {
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
};

export const IconButtonBase: FC<IconButtonBaseProps> = ({
    disabled = false,
    icon,
    render,
    type = 'filled',
    ...renderProps
}) => {
    const [{eventName, layout}, setState] = useImmer(initialState);
    const id = useId();
    const [underlayColor] = useUnderlayColor({type});
    const onStateChange = useMemo(() => processStateChange({setState}), [setState]);
    const [onEvent] = HOOK.useOnEvent({
        ...renderProps,
        disabled,
        onStateChange,
    });

    const [{backgroundColor, borderColor}] = useAnimated({disabled, type});
    const [iconElement] = useIcon({eventName, type, icon, disabled});
    const [border] = useBorder({borderColor});

    return render({
        ...renderProps,
        eventName,
        icon: iconElement,
        id,
        onEvent,
        type,
        underlayColor,
        renderStyle: {
            ...border,
            backgroundColor,
            height: layout?.height,
            width: layout?.width,
        },
    });
};
