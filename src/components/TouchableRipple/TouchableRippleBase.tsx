import {FC, useCallback, useEffect, useId, useMemo} from 'react';
import {GestureResponderEvent} from 'react-native';
import {useImmer} from 'use-immer';
import {
    OnEvent,
    OnStateChangeOptions,
    useHandleEvent,
} from '../../hooks/useHandleEvent';
import {State} from '../Common/interface';
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

const renderRipples = (rippleSequence: RippleSequence, options: RippleProps) =>
    Object.entries(rippleSequence).map(([sequence, {location}]) => (
        <Ripple
            {...options}
            key={sequence}
            location={location}
            sequence={sequence}
        />
    ));

const initialState = {
    rippleSequence: {} as RippleSequence,
};

export const TouchableRippleBase: FC<TouchableRippleBaseProps> = props => {
    const {
        active,
        activeEvent,
        children,
        onRippleAnimatedEnd,
        render,
        underlayColor,
        ...renderProps
    } = props;

    const [{rippleSequence}, setState] = useImmer(initialState);
    const id = useId();

    const processAddRipple = useCallback(
        (event: GestureResponderEvent) => {
            const {locationX, locationY} = event.nativeEvent;

            setState(draft => {
                draft.rippleSequence[`${Date.now()}`] = {
                    exitAnimated: undefined,
                    location: {locationX, locationY},
                };
            });
        },
        [setState],
    );

    const processStateChange = useCallback(
        (_nextState: State, options = {} as OnStateChangeOptions) => {
            const {event, eventName} = options;
            const addRipple =
                typeof active !== 'boolean' && eventName === 'pressOut';

            addRipple && processAddRipple(event as GestureResponderEvent);
        },
        [active, processAddRipple],
    );

    const {layout, ...onEvent} = useHandleEvent({
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

    const processRippleEntryAnimatedStart = useCallback(
        (sequence: string, exitAnimated: (finished?: () => void) => void) => {
            exitAnimated(() => {
                setState(draft => {
                    delete draft.rippleSequence[sequence];
                });
            });
        },
        [setState],
    );

    const ripples = useMemo(
        () => (
            <>
                {typeof layout.width === 'number' &&
                    renderRipples(rippleSequence, {
                        onEntryAnimatedStart: processRippleEntryAnimatedStart,
                        touchableLayout: layout,
                        underlayColor,
                        active,
                    })}
            </>
        ),
        [
            active,
            layout,
            processRippleEntryAnimatedStart,
            rippleSequence,
            underlayColor,
        ],
    );

    const childrenElement = (
        <>
            {children}
            {ripples}
        </>
    );

    useEffect(() => {
        typeof active === 'boolean' && active
            ? activeEvent && processAddRipple(activeEvent)
            : processRippleExit();
    }, [active, activeEvent, processAddRipple, processRippleExit]);

    return render({
        ...renderProps,
        children: childrenElement,
        id,
        onEvent,
    });
};
