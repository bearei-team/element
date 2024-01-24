import {FC, useEffect, useId, useMemo} from 'react';
import {GestureResponderEvent, LayoutChangeEvent, LayoutRectangle} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {HOOK} from '../../hooks/hook';
import {OnEvent, OnStateChangeOptions} from '../../hooks/useOnEvent';
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

export interface ProcessEventOptions {
    setState?: Updater<typeof initialState>;
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

export type ProcessStateChangeOptions = ProcessPressOutOptions;
export type ProcessRippleExitOptions = ProcessEventOptions &
    Pick<RenderProps, 'onRippleAnimatedEnd'>;

export type ProcessRippleEntryAnimatedEndOptions = ProcessEventOptions &
    Pick<RenderProps, 'onRippleAnimatedEnd'> & {activeRipple: boolean};

const processAddRipple =
    ({setState, activeRipple}: ProcessAddRippleOptions) =>
    ({locationX, locationY}: AddRippleOptions) =>
        setState?.(draft => {
            const exist = activeRipple && Object.keys(draft.rippleSequence).length !== 0;

            if (exist) {
                return;
            }

            draft.rippleSequence[`${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`] = {
                exitAnimated: undefined,
                location: {locationX, locationY},
            };
        });

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState?.(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processPressOut = (
    event: GestureResponderEvent,
    {activeRipple, setState}: ProcessPressOutOptions,
) => {
    const {locationX, locationY} = event.nativeEvent;

    if (!activeRipple) {
        processAddRipple({activeRipple, setState})({locationX, locationY});
    }
};

const processStateChange =
    ({setState, activeRipple}: ProcessStateChangeOptions) =>
    (_state: State, {event, eventName} = {} as OnStateChangeOptions) => {
        const nextEvent = {
            layout: () => processLayout(event as LayoutChangeEvent, {setState}),
            pressOut: () =>
                processPressOut(event as GestureResponderEvent, {setState, activeRipple}),
        };

        nextEvent[eventName as keyof typeof nextEvent]?.();
    };

const processRippleExit =
    ({setState, onRippleAnimatedEnd}: ProcessRippleExitOptions) =>
    () => {
        const rippleExit = ([sequence, {exitAnimated}]: [string, Ripple]) =>
            exitAnimated?.(() => {
                setState?.(draft => {
                    if (draft.rippleSequence[sequence]) {
                        delete draft.rippleSequence[sequence];
                    }
                });

                onRippleAnimatedEnd?.();
            });

        setState?.(draft => {
            Object.entries(draft.rippleSequence).forEach(rippleExit);
        });
    };

/**
 * Handle the event after the ripple entry animation is finished, if it is an active ripple,
 * then the ripple exit animation should be added to the ripple sequence to be used.
 * Otherwise, execute the ripple exit animation directly.
 */
const processRippleEntryAnimatedEnd =
    ({activeRipple, setState, onRippleAnimatedEnd}: ProcessRippleEntryAnimatedEndOptions) =>
    (sequence: string, exitAnimated: (finished?: () => void) => void) => {
        if (activeRipple) {
            return setState?.(draft => {
                draft.rippleSequence[sequence] &&
                    (draft.rippleSequence[sequence].exitAnimated = exitAnimated);

                draft.status === 'idle' && (draft.status = 'succeeded');
            });
        }

        exitAnimated(() => {
            setState?.(draft => {
                if (draft.rippleSequence[sequence]) {
                    delete draft.rippleSequence[sequence];
                }
            });

            onRippleAnimatedEnd?.();
        });
    };

const renderRipples = (rippleSequence: RippleSequence, props: Omit<RippleProps, 'sequence'>) =>
    Object.entries(rippleSequence).map(([sequence, {location}]) => (
        <Ripple {...props} key={sequence} location={location} sequence={sequence} />
    ));

const initialState = {
    layout: {} as LayoutRectangle,
    rippleSequence: {} as RippleSequence,
    status: 'idle' as ComponentStatus,
};

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
    const [{rippleSequence, status, layout}, setState] = useImmer(initialState);
    const id = useId();
    const activeRipple = [typeof defaultActive, typeof active].includes('boolean');
    const onStateChange = useMemo(
        () => processStateChange({setState, activeRipple}),
        [activeRipple, setState],
    );

    const [onEvent] = HOOK.useOnEvent({
        ...renderProps,
        disabled,
        onStateChange,
    });

    const onEntryAnimatedEnd = useMemo(
        () => processRippleEntryAnimatedEnd({activeRipple, setState, onRippleAnimatedEnd}),
        [activeRipple, onRippleAnimatedEnd, setState],
    );

    const addRipple = useMemo(
        () => processAddRipple({activeRipple, setState}),
        [activeRipple, setState],
    );

    const rippleExit = useMemo(
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
        const defaultRipple = activeRipple && defaultActive;

        if (status === 'idle') {
            if (defaultRipple) {
                return addRipple({locationX: 0, locationY: 0});
            }

            setState(draft => {
                draft.status = 'succeeded';
            });
        }
    }, [activeRipple, addRipple, defaultActive, setState, status]);

    useEffect(() => {
        if (status === 'succeeded' && typeof active === 'boolean') {
            active ? activeLocation && addRipple(activeLocation) : rippleExit();
        }
    }, [active, activeLocation, addRipple, rippleExit, status]);

    return render({
        ...renderProps,
        id,
        onEvent,
        ripples,
    });
};
