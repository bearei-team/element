import {FC, useId, useMemo} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, ViewStyle} from 'react-native';
import {Updater, useImmer} from 'use-immer';
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
    (_nextState: State, {event, eventName} = {} as OnStateChangeOptions) => {
        if (eventName === 'layout') {
            processLayout(event as LayoutChangeEvent, {setState});
        }
    };

const initialState = {
    layout: {} as LayoutRectangle,
};

export const ElevationBase: FC<ElevationBaseProps> = ({
    level,
    render,
    defaultLevel,
    ...renderProps
}) => {
    const [{layout}, setState] = useImmer(initialState);
    const id = useId();
    const [{shadow0Opacity, shadow1Opacity}] = useAnimated({
        defaultLevel,
        level,
    });

    const onStateChange = useMemo(() => processStateChange({setState}), [setState]);
    const [onEvent] = HOOK.useOnEvent({
        ...renderProps,
        onStateChange: onStateChange,
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
