import {FC, useCallback, useId} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, ViewStyle} from 'react-native';
import {useImmer} from 'use-immer';
import {HOOK} from '../../hooks/hook';
import {OnEvent, OnStateChangeOptions} from '../../hooks/useOnEvent';
import {AnimatedInterpolation, State} from '../Common/interface';
import {ElevationProps} from './Elevation';
import {useAnimated} from './useAnimated';

export interface RenderProps extends ElevationProps {
    onContentLayout?: (event: LayoutChangeEvent) => void;
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        height: number;
        opacity0?: AnimatedInterpolation;
        opacity1?: AnimatedInterpolation;
        width: number;
    };
}

export interface ElevationBaseProps extends ElevationProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const initialState = {
    layout: {} as LayoutRectangle,
};

export const ElevationBase: FC<ElevationBaseProps> = props => {
    const {level, render, defaultLevel, ...renderProps} = props;
    const [{layout}, setState] = useImmer(initialState);
    const id = useId();
    const [{shadow0Opacity, shadow1Opacity}] = useAnimated({
        defaultLevel,
        level,
    });

    const processLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const nativeEventLayout = event.nativeEvent.layout;

            setState(draft => {
                draft.layout = nativeEventLayout;
            });
        },
        [setState],
    );

    const processStateChange = useCallback(
        (_nextState: State, options = {} as OnStateChangeOptions) => {
            const {event, eventName} = options;

            if (eventName === 'layout') {
                processLayout(event as LayoutChangeEvent);
            }
        },
        [processLayout],
    );

    const [onEvent] = HOOK.useOnEvent({
        ...props,
        onStateChange: processStateChange,
    });

    return render({
        ...renderProps,
        id,
        level: level ?? defaultLevel,
        onEvent,
        renderStyle: {
            height: layout.height,
            opacity0: shadow0Opacity,
            opacity1: shadow1Opacity,
            width: layout.width,
        },
    });
};
