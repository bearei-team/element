import {Draft} from 'immer';
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
import {ComponentStatus, State} from '../Common/interface';
import {Ripple, RippleProps} from './Ripple/Ripple';

type TouchableProps = PressableProps &
    Pick<RippleProps, 'underlayColor' | 'centered' | 'active' | 'location'> &
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
interface Ripple extends Pick<RippleProps, 'location'> {
    exitAnimated?: ExitAnimated;
}

type RippleSequence = Record<string, Ripple>;
interface InitialState {
    layout: LayoutRectangle;
    rippleSequence: RippleSequence;
    status: ComponentStatus;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

interface AddRippleOptions {
    locationX: number;
    locationY: number;
}

type ProcessAddRippleOptions = ProcessEventOptions &
    Pick<RenderProps, 'active'> &
    AddRippleOptions & {draft?: Draft<InitialState>};

type ProcessPressOutOptions = Omit<ProcessAddRippleOptions, 'locationX' | 'locationY'>;
type ProcessRippleExitOptions = ProcessEventOptions & Pick<RenderProps, 'onRippleAnimatedEnd'>;
type ProcessStateChangeOptions = ProcessPressOutOptions & OnStateChangeOptions;
type ProcessRippleEntryAnimatedEndOptions = ProcessEventOptions &
    Pick<RenderProps, 'active'> & {exitAnimated: ExitAnimated} & Pick<
        RenderProps,
        'onRippleAnimatedEnd'
    >;

type AddRipple = (options: AddRippleOptions & {draft?: Draft<InitialState>}) => void;
type ProcessInitOptions = ProcessEventOptions &
    Pick<RenderProps, 'active'> & {addRipple: AddRipple};

type ProcessActiveOptions = Pick<RenderProps, 'active' | 'location'> &
    ProcessEventOptions & {addRipple: AddRipple; rippleExit: () => void};

const processAddRipple = ({
    active,
    draft: draftSource,
    locationX,
    locationY,
    setState,
}: ProcessAddRippleOptions) => {
    const addRipple = (draft: Draft<InitialState>) => {
        const exist = active && Object.keys(draft.rippleSequence).length !== 0;

        !exist &&
            (draft.rippleSequence[`${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`] = {
                exitAnimated: undefined,
                location: {locationX, locationY},
            });
    };

    draftSource
        ? addRipple(draftSource)
        : setState(draft => {
              addRipple(draft);
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

    typeof active !== 'boolean' && processAddRipple({setState, locationX, locationY});
};

const processStateChange = ({event, eventName, setState, active}: ProcessStateChangeOptions) => {
    const nextEvent = {
        layout: () => processLayout(event as LayoutChangeEvent, {setState}),
        pressOut: () => processPressOut(event as GestureResponderEvent, {setState, active}),
    };

    nextEvent[eventName as keyof typeof nextEvent]?.();
};

const processRippleExit = ({setState, onRippleAnimatedEnd}: ProcessRippleExitOptions) => {
    const rippleExit = ([_sequence, {exitAnimated}]: [string, Ripple]) =>
        exitAnimated?.(() => onRippleAnimatedEnd?.());

    setState(draft => {
        Object.entries(draft.rippleSequence).forEach(rippleExit);
    });
};

const processRippleEntryAnimatedEnd = (
    sequence: string,
    {active, setState, onRippleAnimatedEnd, exitAnimated}: ProcessRippleEntryAnimatedEndOptions,
) => {
    if (typeof active === 'boolean') {
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

const processInit = ({active, setState, addRipple}: ProcessInitOptions) => {
    setState(draft => {
        if (draft.status !== 'idle') {
            return;
        }

        if (active) {
            addRipple({draft, locationX: 0, locationY: 0});
            return;
        }

        draft.status = 'succeeded';
    });
};

const processActive = ({
    active,
    location,
    addRipple,
    rippleExit,
    setState,
}: ProcessActiveOptions) => {
    setState(draft => {
        if (draft.status !== 'succeeded' || typeof active !== 'boolean') {
            return;
        }

        active ? location && addRipple(location) : rippleExit();
    });
};

const renderRipples = (
    rippleSequence: RippleSequence,
    {touchableLayout, ...props}: Omit<RippleProps, 'sequence'>,
) => {
    if (typeof touchableLayout?.width !== 'number' || touchableLayout?.width === 0) {
        return <></>;
    }

    return Object.entries(rippleSequence).map(([sequence, {location}]) => (
        <Ripple
            {...props}
            key={sequence}
            location={location}
            sequence={sequence}
            touchableLayout={touchableLayout}
        />
    ));
};

export const TouchableRippleBase: FC<TouchableRippleBaseProps> = ({
    active: activeSource,
    centered,
    defaultActive,
    disabled,
    location,
    onRippleAnimatedEnd,
    render,
    underlayColor,
    ...renderProps
}) => {
    const [{rippleSequence, layout}, setState] = useImmer<InitialState>({
        layout: {} as LayoutRectangle,
        rippleSequence: {} as RippleSequence,
        status: 'idle',
    });

    const id = useId();
    const active = activeSource ?? defaultActive;
    const onStateChange = useCallback(
        (_state: State, options = {} as OnStateChangeOptions) =>
            processStateChange({...options, setState, active}),
        [active, setState],
    );

    const [onEvent] = useOnEvent({...renderProps, disabled, onStateChange});
    const onEntryAnimatedEnd = useCallback(
        (sequence: string, exitAnimated: ExitAnimated) =>
            processRippleEntryAnimatedEnd(sequence, {
                active,
                exitAnimated,
                onRippleAnimatedEnd,
                setState,
            }),
        [active, onRippleAnimatedEnd, setState],
    );

    const addRipple = useCallback(
        (options: AddRippleOptions) => processAddRipple({...options, active, setState}),
        [active, setState],
    );

    const rippleExit = useCallback(
        () => processRippleExit({onRippleAnimatedEnd, setState}),
        [onRippleAnimatedEnd, setState],
    );

    const ripples = useMemo(
        () =>
            renderRipples(rippleSequence, {
                active,
                centered,
                onEntryAnimatedEnd,
                touchableLayout: layout,
                underlayColor,
            }),
        [active, centered, layout, onEntryAnimatedEnd, rippleSequence, underlayColor],
    );

    useEffect(() => {
        processActive({active, location, addRipple, rippleExit, setState});
    }, [active, location, addRipple, rippleExit, setState]);

    useEffect(() => {
        processInit({active, addRipple, setState});
    }, [active, addRipple, setState]);

    return render({
        ...renderProps,
        id,
        onEvent,
        ripples,
    });
};
