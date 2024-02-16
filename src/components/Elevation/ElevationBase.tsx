import {FC, useCallback, useId} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, ViewStyle} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
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

export interface InitialState {
    layout: LayoutRectangle;
}

export interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

export type ProcessStateChangeOptions = OnStateChangeOptions & ProcessEventOptions;

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processStateChange = ({event, eventName, setState}: ProcessStateChangeOptions) =>
    eventName === 'layout' && processLayout(event as LayoutChangeEvent, {setState});

export const ElevationBase: FC<ElevationBaseProps> = ({
    level,
    render,
    defaultLevel,
    ...renderProps
}) => {
    const [{layout}, setState] = useImmer<InitialState>({
        layout: {} as LayoutRectangle,
    });

    const id = useId();
    const [{shadow0Opacity, shadow1Opacity}] = useAnimated({defaultLevel, level});
    const onStateChange = useCallback(
        (_state: State, options = {} as OnStateChangeOptions) =>
            processStateChange({...options, setState}),
        [setState],
    );

    const [onEvent] = useOnEvent({...renderProps, onStateChange});

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
