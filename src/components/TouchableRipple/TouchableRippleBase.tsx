import {FC, useCallback, useEffect, useId, useMemo} from 'react';
import {GestureResponderEvent, LayoutChangeEvent, LayoutRectangle} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {ComponentStatus, State} from '../Common/interface';
import {Ripple, RippleProps} from './Ripple/Ripple';
import {TouchableRippleProps} from './TouchableRipple';

export interface RenderProps extends Omit<TouchableRippleProps, 'centered'> {
    onEvent: OnEvent;
    ripples: React.JSX.Element | React.JSX.Element[];
}

export interface TouchableRippleBaseProps extends TouchableRippleProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface Ripple extends Pick<RippleProps, 'location'> {
    exitAnimated?: (finished?: () => void) => void;
}

export type RippleSequence = Record<string, Ripple>;

export interface InitialState {
    layout: LayoutRectangle;
    rippleSequence: RippleSequence;
    status: ComponentStatus;
    shouldUpdate: Record<string, unknown>;
}

export interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

export interface AddRippleOptions {
    locationX: number;
    locationY: number;
}

export interface ProcessAddRippleOptions extends ProcessEventOptions {
    activeRipple: boolean;
}

export interface ProcessPressOutOptions extends ProcessEventOptions {
    activeRipple: boolean;
}

export type ProcessStateChangeOptions = ProcessPressOutOptions & OnStateChangeOptions;
export type ProcessRippleExitOptions = ProcessEventOptions &
    Pick<RenderProps, 'onRippleAnimatedEnd'>;

export type ProcessRippleEntryAnimatedEndOptions = ProcessEventOptions &
    Pick<RenderProps, 'onRippleAnimatedEnd'> & {activeRipple: boolean} & {
        exitAnimated: (finished?: () => void) => void;
    };

export type ProcessInitOptions = {
    activeRipple: boolean;
    addRipple: (options: AddRippleOptions) => void;
} & Pick<RenderProps, 'defaultActive'> &
    ProcessEventOptions;

export type ProcessActiveOptions = Pick<RenderProps, 'active' | 'activeLocation'> & {
    addRipple: (options: AddRippleOptions) => void;
    rippleExit: () => void;
};

const processAddRipple = ({
    locationX,
    locationY,
    setState,
    activeRipple,
}: AddRippleOptions & ProcessAddRippleOptions) =>
    setState(draft => {
        const exist = activeRipple && Object.keys(draft.rippleSequence).length !== 0;

        !exist &&
            (draft.rippleSequence[`${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`] = {
                exitAnimated: undefined,
                location: {locationX, locationY},
            });
    });

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processPressOut = (
    event: GestureResponderEvent,
    {activeRipple, setState}: ProcessPressOutOptions,
) => {
    const {locationX, locationY} = event.nativeEvent;

    !activeRipple && processAddRipple({activeRipple, setState, locationX, locationY});
};

const processStateChange = ({
    event,
    eventName,
    setState,
    activeRipple,
}: ProcessStateChangeOptions) => {
    const nextEvent = {
        layout: () => processLayout(event as LayoutChangeEvent, {setState}),
        pressOut: () => processPressOut(event as GestureResponderEvent, {setState, activeRipple}),
    };

    nextEvent[eventName as keyof typeof nextEvent]?.();
};

const processRippleExit = ({setState, onRippleAnimatedEnd}: ProcessRippleExitOptions) => {
    const rippleExit = ([_sequence, {exitAnimated}]: [string, Ripple]) =>
        exitAnimated?.(() => onRippleAnimatedEnd?.());

    setState(draft => {
        Object.entries(draft.rippleSequence).forEach(rippleExit);
        draft.rippleSequence = {};
    });
};

/**
 * Handle the event after the ripple entry animation is finished, if it is an active ripple,
 * then the ripple exit animation should be added to the ripple sequence to be used.
 * Otherwise, execute the ripple exit animation directly.
 */
const processRippleEntryAnimatedEnd = (
    sequence: string,
    {
        activeRipple,
        setState,
        onRippleAnimatedEnd,
        exitAnimated,
    }: ProcessRippleEntryAnimatedEndOptions,
) => {
    if (activeRipple) {
        return setState(draft => {
            draft.rippleSequence[sequence] &&
                (draft.rippleSequence[sequence].exitAnimated = exitAnimated);

            draft.status === 'idle' && (draft.status = 'succeeded');
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

const processInit = (
    status: ComponentStatus,
    {activeRipple, defaultActive, setState, addRipple}: ProcessInitOptions,
) => {
    if (status !== 'idle') {
        return;
    }

    const defaultRipple = activeRipple && defaultActive;

    if (defaultRipple) {
        return addRipple({locationX: 0, locationY: 0});
    }

    setState(draft => {
        draft.status = 'succeeded';
    });
};

const processActive = (
    status: ComponentStatus,
    {active, activeLocation, addRipple, rippleExit}: ProcessActiveOptions,
) => {
    const setActive = status === 'succeeded' && typeof active === 'boolean';

    setActive && (active ? activeLocation && addRipple(activeLocation) : rippleExit());
};

const renderRipples = (rippleSequence: RippleSequence, props: Omit<RippleProps, 'sequence'>) =>
    Object.entries(rippleSequence).map(([sequence, {location}]) => (
        <Ripple {...props} key={sequence} location={location} sequence={sequence} />
    ));

export const TouchableRippleBase: FC<TouchableRippleBaseProps> = ({
    active,
    activeLocation,
    centered,
    defaultActive,
    disabled,
    onRippleAnimatedEnd,
    render,
    underlayColor,
    ...renderProps
}) => {
    const [{rippleSequence, status, layout}, setState] = useImmer<InitialState>({
        layout: {} as LayoutRectangle,
        rippleSequence: {} as RippleSequence,
        shouldUpdate: {},
        status: 'idle',
    });

    const id = useId();
    const activeRipple = [typeof defaultActive, typeof active].includes('boolean');
    const onStateChange = useCallback(
        (_state: State, options = {} as OnStateChangeOptions) =>
            processStateChange({...options, setState, activeRipple}),
        [activeRipple, setState],
    );

    const [onEvent] = useOnEvent({...renderProps, disabled, onStateChange});
    const onEntryAnimatedEnd = useCallback(
        (sequence: string, exitAnimated: (finished?: () => void) => void) =>
            processRippleEntryAnimatedEnd(sequence, {
                activeRipple,
                exitAnimated,
                onRippleAnimatedEnd,
                setState,
            }),
        [activeRipple, onRippleAnimatedEnd, setState],
    );

    const addRipple = useCallback(
        (options: AddRippleOptions) => processAddRipple({...options, activeRipple, setState}),
        [activeRipple, setState],
    );

    const rippleExit = useCallback(
        () => processRippleExit({onRippleAnimatedEnd, setState}),
        [onRippleAnimatedEnd, setState],
    );

    const ripples = useMemo(() => {
        const renderRipple = typeof layout.width === 'number' && layout.width !== 0;

        if (!renderRipple) {
            return <></>;
        }

        return renderRipples(rippleSequence, {
            active,
            defaultActive,
            onEntryAnimatedEnd,
            touchableLayout: layout,
            underlayColor,
            centered,
        });
    }, [
        active,
        centered,
        defaultActive,
        layout,
        onEntryAnimatedEnd,
        rippleSequence,
        underlayColor,
    ]);

    /**
     * When rendering a component for the first time, if the component has active ripples and is
     * active by default. Initialize the default ripple here.
     */
    useEffect(() => {
        processInit(status, {activeRipple, addRipple, defaultActive, setState});
    }, [activeRipple, addRipple, defaultActive, setState, status]);

    useEffect(() => {
        processActive(status, {active, activeLocation, addRipple, rippleExit});
    }, [active, activeLocation, addRipple, rippleExit, status]);

    return render({
        ...renderProps,
        id,
        onEvent,
        ripples,
    });
};
