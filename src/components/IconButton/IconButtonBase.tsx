import {FC, useCallback, useId} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    TextStyle,
    ViewStyle,
} from 'react-native';
import {useImmer} from 'use-immer';
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

const initialState = {
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
};

export const IconButtonBase: FC<IconButtonBaseProps> = props => {
    const {
        disabled = false,
        icon,
        render,
        type = 'filled',
        ...renderProps
    } = props;

    const [{eventName, layout}, setState] = useImmer(initialState);
    const id = useId();
    const [underlayColor] = useUnderlayColor({type});

    const processStateChange = useCallback(
        (_nextState: State, options = {} as OnStateChangeOptions) => {
            const {event, eventName: nextEventName} = options;

            if (nextEventName === 'layout') {
                const nativeEventLayout = (event as LayoutChangeEvent)
                    .nativeEvent.layout;

                setState(draft => {
                    draft.layout = nativeEventLayout;
                });
            }

            setState(draft => {
                draft.eventName = nextEventName;
            });
        },
        [setState],
    );
    const [onEvent] = HOOK.useOnEvent({
        ...props,
        disabled,
        onStateChange: processStateChange,
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
