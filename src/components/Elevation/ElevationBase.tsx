import {FC, useCallback, useEffect, useId} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, ViewStyle} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {AnimatedInterpolation, ComponentStatus, State} from '../Common/interface';
import {ElevationLevel, ElevationProps} from './Elevation';
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
    level?: ElevationLevel;
    status: ComponentStatus;
}

export interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

export type ProcessStateChangeOptions = OnStateChangeOptions & ProcessEventOptions;
export type ProcessInitOptions = Pick<ElevationProps, 'defaultLevel'> & ProcessEventOptions;
export type ProcessLevelOptions = Pick<RenderProps, 'level'> & ProcessEventOptions;

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processLevel = ({setState, level}: ProcessLevelOptions) =>
    typeof level === 'number' &&
    setState(draft => {
        if (draft.status !== 'succeeded' || draft.level === level) {
            return;
        }

        draft.level = level;
    });

const processInit = ({defaultLevel, setState}: ProcessInitOptions) =>
    setState(draft => {
        if (draft.status !== 'idle') {
            return;
        }

        typeof defaultLevel === 'number' && (draft.level = defaultLevel);
        draft.status = 'succeeded';
    });

const processStateChange = ({event, eventName, setState}: ProcessStateChangeOptions) =>
    eventName === 'layout' && processLayout(event as LayoutChangeEvent, {setState});

export const ElevationBase: FC<ElevationBaseProps> = ({
    defaultLevel,
    level: levelSource,
    render,
    ...renderProps
}) => {
    const [{layout, level, status}, setState] = useImmer<InitialState>({
        layout: {} as LayoutRectangle,
        level: undefined,
        status: 'idle',
    });

    const id = useId();
    const [{shadow0Opacity, shadow1Opacity}] = useAnimated({defaultLevel, level, setState});
    const onStateChange = useCallback(
        (_state: State, options = {} as OnStateChangeOptions) =>
            processStateChange({...options, setState}),
        [setState],
    );

    const [onEvent] = useOnEvent({...renderProps, onStateChange});

    useEffect(() => {
        processLevel({level: levelSource, setState});
    }, [levelSource, setState]);

    useEffect(() => {
        processInit({defaultLevel, setState});
    }, [defaultLevel, setState]);

    if (status === 'idle') {
        return <></>;
    }

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
