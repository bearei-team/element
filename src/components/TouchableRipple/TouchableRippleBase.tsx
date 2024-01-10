import {FC, useCallback, useEffect, useId, useMemo} from 'react';
import {
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
} from 'react-native';
import {useImmer} from 'use-immer';
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

export interface ProcessAddRippleOptions {
    locationX: number;
    locationY: number;
}

const renderRipples = (
    rippleSequence: RippleSequence,
    props: Omit<RippleProps, 'sequence'>,
) =>
    Object.entries(rippleSequence).map(([sequence, {location}]) => (
        <Ripple
            {...props}
            key={sequence}
            location={location}
            sequence={sequence}
        />
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
        centered = false,
        children,
        defaultActive,
        onRippleAnimatedEnd,
        render,
        underlayColor,
        ...renderProps
    } = props;

    const [{rippleSequence, status, layout}, setState] = useImmer(initialState);
    const id = useId();
    const activeRipple = [typeof defaultActive, typeof active].includes(
        'boolean',
    );

    const processAddRipple = useCallback(
        (options: ProcessAddRippleOptions) => {
            const {locationX, locationY} = options;

            setState(draft => {
                const existRipple =
                    activeRipple &&
                    Object.keys(draft.rippleSequence).length !== 0;

                if (existRipple) {
                    return;
                }

                draft.rippleSequence[`${Date.now()}`] = {
                    exitAnimated: undefined,
                    location: {locationX, locationY},
                };
            });
        },
        [activeRipple, setState],
    );

    const processLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const nativeEventLayout = event.nativeEvent.layout;

            setState(draft => {
                draft.layout = nativeEventLayout;
            });
        },
        [setState],
    );

    const processPressOut = useCallback(
        (event: GestureResponderEvent) => {
            if (!activeRipple) {
                processAddRipple(event.nativeEvent);
            }
        },
        [activeRipple, processAddRipple],
    );

    const processStateChange = useCallback(
        (_nextState: State, options = {} as OnStateChangeOptions) => {
            const {event, eventName} = options;
            const nextEvent = {
                layout: () => {
                    processLayout(event as LayoutChangeEvent);
                },
                pressOut: () => {
                    processPressOut(event as GestureResponderEvent);
                },
            };

            nextEvent[eventName as keyof typeof nextEvent]?.();
        },
        [processLayout, processPressOut],
    );

    const [onEvent] = HOOK.useOnEvent({
        ...props,
        disabled: false,
        onStateChange: processStateChange,
    });

    const processRippleExit = useCallback(() => {
        const rippleExit = (options: [string, Ripple]) => {
            const [sequence, {exitAnimated}] = options;

            exitAnimated?.(() => {
                setState(draft => {
                    delete draft.rippleSequence[sequence];
                });

                onRippleAnimatedEnd?.();
            });
        };

        setState(draft => {
            Object.entries(draft.rippleSequence).forEach(rippleExit);
        });
    }, [onRippleAnimatedEnd, setState]);

    /**
     * Handle the event after the ripple entry animation is finished, if it is an active ripple,
     * then the ripple exit animation should be added to the ripple sequence to be used.
     * Otherwise, execute the ripple exit animation directly.
     */
    const processRippleEntryAnimatedEnd = useCallback(
        (sequence: string, exitAnimated: (finished?: () => void) => void) => {
            if (activeRipple) {
                return setState(draft => {
                    draft.rippleSequence[sequence].exitAnimated = exitAnimated;
                    draft.status === 'idle' && (draft.status = 'succeeded');
                });
            }

            exitAnimated(() => {
                setState(draft => {
                    delete draft.rippleSequence[sequence];
                });

                onRippleAnimatedEnd?.();
            });
        },
        [activeRipple, onRippleAnimatedEnd, setState],
    );

    const ripples = useMemo(() => {
        const renderRipple =
            typeof layout.width === 'number' && layout.width !== 0;

        if (!renderRipple) {
            return <></>;
        }

        return renderRipples(rippleSequence, {
            active,
            defaultActive,
            onEntryAnimatedEnd: processRippleEntryAnimatedEnd,
            touchableLayout: layout,
            underlayColor,
            centered,
        });
    }, [
        active,
        centered,
        defaultActive,
        layout,
        processRippleEntryAnimatedEnd,
        rippleSequence,
        underlayColor,
    ]);

    const childrenElement = (
        <>
            {children}
            {ripples}
        </>
    );

    useEffect(() => {
        if (status === 'idle') {
            const addRipple = activeRipple && defaultActive;

            if (addRipple) {
                return processAddRipple({locationX: 0, locationY: 0});
            }

            setState(draft => {
                draft.status = 'succeeded';
            });
        }
    }, [
        activeRipple,
        processAddRipple,
        setState,
        status,
        active,
        defaultActive,
    ]);

    useEffect(() => {
        const processRipple = activeRipple;

        if (!processRipple) {
            return;
        }

        if (status === 'succeeded' && typeof active === 'boolean') {
            active
                ? activeLocation && processAddRipple(activeLocation)
                : processRippleExit();
        }
    }, [
        activeLocation,
        activeRipple,
        processAddRipple,
        processRippleExit,
        setState,
        status,
        active,
    ]);

    return render({
        ...renderProps,
        children: childrenElement,
        id,
        onEvent,
    });
};
