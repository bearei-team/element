import {FC, RefAttributes, useCallback, useEffect, useId, useMemo} from 'react';
import {
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    PressableProps,
    View,
    ViewProps,
} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {ShapeProps} from '../Common/Common.styles';
import {EventName, State} from '../Common/interface';
import {Ripple, RippleProps} from './Ripple/Ripple';

type TouchableProps = PressableProps &
    Pick<RippleProps, 'underlayColor' | 'centered' | 'active' | 'touchableLocation'> &
    Pick<ShapeProps, 'shape'> &
    RefAttributes<View> &
    ViewProps;

export interface TouchableRippleProps
    extends Omit<TouchableProps, 'children' | 'disabled' | 'hitSlop'> {
    children?: React.JSX.Element;
    defaultActive?: boolean;
    disabled?: boolean;
    onRippleAnimatedEnd?: () => void;
}

export interface RenderProps extends Omit<TouchableRippleProps, 'centered'> {
    onEvent: OnEvent;
    ripples: React.JSX.Element | React.JSX.Element[];
}

interface TouchableRippleBaseProps extends TouchableRippleProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export type ExitAnimated = (finished?: () => void) => void;
interface Ripple extends Pick<RippleProps, 'touchableLocation'> {
    exitAnimated?: ExitAnimated;
}

type RippleSequence = Record<string, Ripple>;
interface InitialState {
    layout: LayoutRectangle;
    rippleSequence: RippleSequence;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessAddRippleOptions = ProcessEventOptions &
    Pick<RenderProps, 'active' | 'touchableLocation'>;

type ProcessPressOutOptions = Omit<ProcessAddRippleOptions, 'locationX' | 'locationY'>;
type ProcessRippleExitOptions = ProcessEventOptions & Pick<RenderProps, 'onRippleAnimatedEnd'>;
type ProcessStateChangeOptions = ProcessPressOutOptions & OnStateChangeOptions;
type ProcessEntryAnimatedFinishedOptions = ProcessEventOptions &
    Pick<RenderProps, 'active'> &
    Pick<RenderProps, 'onRippleAnimatedEnd'> & {exitAnimated: ExitAnimated};

type ProcessActiveOptions = Pick<
    RenderProps,
    'active' | 'touchableLocation' | 'onRippleAnimatedEnd'
> &
    ProcessEventOptions;

type RenderRipplesOptions = Omit<RippleProps, 'sequence'>;

const processAddRipple = ({active, touchableLocation, setState}: ProcessAddRippleOptions) => {
    setState(draft => {
        const keys = Object.keys(draft.rippleSequence);
        const exist = active && keys.length !== 0;

        if (exist) {
            draft.rippleSequence = {
                [keys[0]]: {...draft.rippleSequence[keys[0]], touchableLocation},
            };

            return;
        }

        draft.rippleSequence[`${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`] = {
            exitAnimated: undefined,
            touchableLocation,
        };
    });
};

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processPressOut = (
    event: GestureResponderEvent,
    {active, setState}: ProcessPressOutOptions,
) => {
    const {locationX, locationY} = event.nativeEvent;

    typeof active !== 'boolean' &&
        processAddRipple({setState, touchableLocation: {locationX, locationY}});
};

const processStateChange = ({event, eventName, setState, active}: ProcessStateChangeOptions) => {
    const nextEvent = {
        layout: () => processLayout(event as LayoutChangeEvent, {setState}),
        pressOut: () => processPressOut(event as GestureResponderEvent, {setState, active}),
    } as Record<EventName, () => void>;

    nextEvent[eventName]?.();
};

const processRippleExit = ({setState, onRippleAnimatedEnd}: ProcessRippleExitOptions) => {
    const rippleExit = ([_sequence, {exitAnimated}]: [string, Ripple]) =>
        exitAnimated?.(() => onRippleAnimatedEnd?.());

    setState(draft => {
        Object.entries(draft.rippleSequence).forEach(rippleExit);
    });
};

const processEntryAnimatedFinished = (
    sequence: string,
    {active, setState, onRippleAnimatedEnd, exitAnimated}: ProcessEntryAnimatedFinishedOptions,
) => {
    if (typeof active === 'boolean') {
        return setState(draft => {
            draft.rippleSequence[sequence] &&
                (draft.rippleSequence[sequence].exitAnimated = exitAnimated);
        });
    }

    exitAnimated(() => {
        setState(draft => {
            if (draft.rippleSequence[sequence]) {
                delete draft.rippleSequence[sequence];
            }
        });

        onRippleAnimatedEnd?.();
    });
};

const processActive = ({
    active,
    onRippleAnimatedEnd,
    setState,
    touchableLocation,
}: ProcessActiveOptions) => {
    if (typeof active !== 'boolean') {
        return;
    }

    active
        ? processAddRipple({touchableLocation, active, setState})
        : processRippleExit({setState, onRippleAnimatedEnd});
};

const renderRipples = (
    rippleSequence: RippleSequence,
    {touchableLayout, centered, ...props}: RenderRipplesOptions,
) => {
    if (typeof touchableLayout?.width !== 'number' || touchableLayout?.width === 0) {
        return <></>;
    }

    return Object.entries(rippleSequence).map(([sequence, {touchableLocation}]) => (
        <Ripple
            {...props}
            key={sequence}
            centered={typeof centered === 'boolean' ? centered : !touchableLocation?.locationX}
            sequence={sequence}
            touchableLayout={touchableLayout}
            touchableLocation={touchableLocation}
        />
    ));
};

export const TouchableRippleBase: FC<TouchableRippleBaseProps> = ({
    active: activeSource,
    centered,
    defaultActive,
    disabled,
    onRippleAnimatedEnd,
    render,
    underlayColor,
    touchableLocation,
    ...renderProps
}) => {
    const [{rippleSequence, layout}, setState] = useImmer<InitialState>({
        layout: {} as LayoutRectangle,
        rippleSequence: {} as RippleSequence,
    });

    const id = useId();
    const active = activeSource ?? defaultActive;
    const onStateChange = useCallback(
        (_state: State, options = {} as OnStateChangeOptions) =>
            processStateChange({...options, setState, active}),
        [active, setState],
    );

    const [onEvent] = useOnEvent({...renderProps, disabled, onStateChange});
    const onEntryAnimatedFinished = useCallback(
        (sequence: string, exitAnimated: ExitAnimated) =>
            processEntryAnimatedFinished(sequence, {
                active,
                exitAnimated,
                onRippleAnimatedEnd,
                setState,
            }),
        [active, onRippleAnimatedEnd, setState],
    );

    const ripples = useMemo(
        () =>
            renderRipples(rippleSequence, {
                active,
                centered,
                id,
                onEntryAnimatedFinished,
                touchableLayout: layout,
                underlayColor,
            }),
        [active, centered, id, layout, onEntryAnimatedFinished, rippleSequence, underlayColor],
    );

    useEffect(() => {
        processActive({active, setState, onRippleAnimatedEnd, touchableLocation});
    }, [active, onRippleAnimatedEnd, setState, touchableLocation]);

    return render({
        ...renderProps,
        id,
        onEvent,
        ripples,
    });
};
