import {FC, RefAttributes, useCallback, useId} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {ShapeProps} from '../Common/Common.styles';
import {AnimatedInterpolation, State} from '../Common/interface';
import {useAnimated} from './useAnimated';

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5 | undefined;
export interface ElevationProps
    extends Partial<ViewProps & RefAttributes<View> & Pick<ShapeProps, 'shape'>> {
    level?: ElevationLevel;
    defaultLevel?: ElevationLevel;
}

export interface RenderProps extends ElevationProps {
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        height: number;
        opacity0?: AnimatedInterpolation;
        opacity1?: AnimatedInterpolation;
        width: number;
    };
}

interface ElevationBaseProps extends ElevationProps {
    render: (props: RenderProps) => React.JSX.Element;
}

interface InitialState {
    layout: LayoutRectangle;
    level?: ElevationLevel;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessStateChangeOptions = OnStateChangeOptions & ProcessEventOptions;

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        const update =
            draft.layout.width !== nativeEventLayout.width ||
            draft.layout.height !== nativeEventLayout.height;

        update && (draft.layout = nativeEventLayout);
    });
};

const processStateChange = ({event, eventName, setState}: ProcessStateChangeOptions) =>
    eventName === 'layout' && processLayout(event as LayoutChangeEvent, {setState});

export const ElevationBase: FC<ElevationBaseProps> = ({
    defaultLevel,
    level: levelSource,
    render,
    ...renderProps
}) => {
    const [{layout}, setState] = useImmer<InitialState>({
        layout: {} as LayoutRectangle,
    });

    const id = useId();
    const level = levelSource ?? defaultLevel;
    const [{shadow0Opacity, shadow1Opacity}] = useAnimated({level});
    const onStateChange = useCallback(
        (_state: State, options = {} as OnStateChangeOptions) =>
            processStateChange({...options, setState}),
        [setState],
    );

    const [onEvent] = useOnEvent({...renderProps, onStateChange});

    return render({
        ...renderProps,
        id,
        level,
        onEvent,
        renderStyle: {
            height: layout.height,
            opacity0: shadow0Opacity,
            opacity1: shadow1Opacity,
            width: layout.width,
        },
    });
};
