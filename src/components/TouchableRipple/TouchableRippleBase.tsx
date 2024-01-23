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
}

export interface TouchableRippleBaseProps extends TouchableRippleProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface Ripple extends Pick<RippleProps, 'location'> {
    exitAnimated?: (finished?: () => void) => void;
}

export type RippleSequence = Record<string, Ripple>;

export interface ProcessOptions {
    setState?: Updater<typeof initialState>;
}

export interface ProcessAddRippleOptions extends ProcessOptions {
    activeRipple: boolean;
}
export interface AddRippleOptions {
    locationX: number;
    locationY: number;
}

export interface ProcessPressOutOptions extends ProcessOptions {
    activeRipple: boolean;
}

export type ProcessStateChangeOptions = ProcessPressOutOptions;
export type ProcessRippleExitOptions = ProcessOptions & Pick<RenderProps, 'onRippleAnimatedEnd'>;
export type ProcessRippleEntryAnimatedEndOptions = ProcessOptions &
    Pick<RenderProps, 'onRippleAnimatedEnd'> & {activeRipple: boolean};

const processAddRipple =
    ({setState, activeRipple}: ProcessAddRippleOptions) =>
    ({locationX, locationY}: AddRippleOptions) =>
        setState?.(draft => {
            const exist = activeRipple && Object.keys(draft.rippleSequence).length !== 0;

            if (exist) {
                return;
            }

            draft.rippleSequence[`${Date.now()}`] = {
                exitAnimated: undefined,
                location: {locationX, locationY},
            };
        });

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessOptions) => {
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
    (_nextState: State, {event, eventName} = {} as OnStateChangeOptions) => {
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

export const TouchableRippleBase: FC<TouchableRippleBaseProps> = props => {
    const {
        active,
        activeLocation,
        centered,
        children,
        defaultActive,
        disabled,
        onRippleAnimatedEnd,
        render,
        underlayColor,
        ...renderProps
    } = props;

    const [{rippleSequence, status, layout}, setState] = useImmer(initialState);
    const id = useId();
    const activeRipple = [typeof defaultActive, typeof active].includes('boolean');
    const onStateChange = useMemo(
        () => processStateChange({setState, activeRipple}),
        [activeRipple, setState],
    );

    const [onEvent] = HOOK.useOnEvent({
        ...props,
        disabled,
        onStateChange,
    });

    const onEntryAnimatedEnd = useMemo(
        () => processRippleEntryAnimatedEnd({activeRipple, setState, onRippleAnimatedEnd}),
        [activeRipple, onRippleAnimatedEnd, setState],
    );

    const addAddRipple = useMemo(
        () => processAddRipple({activeRipple, setState}),
        [activeRipple, setState],
    );

    const exitRipple = useMemo(
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

    const childrenElement = (
        <>
            {children}
            {ripples}
        </>
    );

    /**
     * When rendering a component for the first time, if the component has active ripples and is active by default.
     * Initialize the default ripple here.
     */
    useEffect(() => {
        const addRipple = activeRipple && defaultActive;

        if (status === 'idle') {
            if (addRipple) {
                return addAddRipple({locationX: 0, locationY: 0});
            }

            setState(draft => {
                draft.status = 'succeeded';
            });
        }
    }, [activeRipple, addAddRipple, defaultActive, setState, status]);

    useEffect(() => {
        const processRipple = activeRipple;

        if (!processRipple) {
            return;
        }

        if (status === 'succeeded' && typeof active === 'boolean') {
            active ? activeLocation && addAddRipple(activeLocation) : exitRipple();
        }
    }, [active, activeLocation, activeRipple, addAddRipple, exitRipple, status]);

    return render({
        ...renderProps,
        children: childrenElement,
        id,
        onEvent,
    });
};
