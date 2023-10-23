import {FC, useCallback, useEffect, useId} from 'react';
import {
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    NativeTouchEvent,
    MouseEvent,
    NativeSyntheticEvent,
    TargetedEvent,
} from 'react-native';
import {useImmer} from 'use-immer';
import {Ripple, RippleAnimatedOut} from './Ripple/Ripple';
import {ulid} from 'ulid';
import {TouchableRippleProps} from './TouchableRipple';
import {HoveredProps} from '../Hovered/Hovered';
import {State} from '../../common/interface';

export type RenderProps = Omit<TouchableRippleProps, 'centered'> & {hoveredProps: HoveredProps};
export interface BaseTouchableRippleProps extends TouchableRippleProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export type Ripple = {
    touchableEvent: NativeTouchEvent;
    animatedOut?: RippleAnimatedOut;
};

export interface ProcessStateOptions {
    callback?: () => void;
    event?: GestureResponderEvent;
}

export type RippleSequence = Record<string, Ripple>;
export const BaseTouchableRipple: FC<BaseTouchableRippleProps> = ({
    onPressIn,
    onPressOut,
    onLayout,
    onHoverIn,
    onHoverOut,
    onFocus,
    onBlur,
    render,
    children,
    underlayColor,
    disabled = false,
    ...args
}): React.JSX.Element => {
    const id = useId();
    const [state, setState] = useImmer<State>('enabled');
    const [layout, setLayout] = useImmer({} as LayoutRectangle);
    const [rippleSequence, setRippleSequence] = useImmer<RippleSequence>({});
    const processState = (nextState: State, {event, callback}: ProcessStateOptions): void => {
        if (state !== 'disabled') {
            callback?.();

            if (nextState === 'pressed') {
                setRippleSequence(draft => {
                    draft[ulid()] = {touchableEvent: event!.nativeEvent, animatedOut: undefined};
                });
            }

            setState(() => nextState);
        }
    };

    const processLayout = (event: LayoutChangeEvent): void => {
        onLayout?.(event);
        setLayout(() => event.nativeEvent.layout);
    };

    const processRippleAnimatedEnd = useCallback(
        (sequence: string, animatedOut: RippleAnimatedOut): void => {
            setRippleSequence(draft => {
                draft[sequence].animatedOut = animatedOut;
            });
        },
        [setRippleSequence],
    );

    const processRippleOut = useCallback((): void => {
        const rippleOut = ([sequence, {animatedOut}]: [string, Ripple]): number | undefined =>
            animatedOut?.(() =>
                setRippleSequence(draft => {
                    delete draft[sequence];
                }),
            );

        Object.entries(rippleSequence).forEach(rippleOut);
    }, [rippleSequence, setRippleSequence]);

    const handlePressIn = (event: GestureResponderEvent): void =>
        processState('pressed', {event, callback: () => onPressIn?.(event)});

    const handlePressOut = (event: GestureResponderEvent): void =>
        processState('hovered', {callback: () => onPressOut?.(event)});

    const handleHoverIn = (event: MouseEvent): void =>
        processState('hovered', {callback: () => onHoverIn?.(event)});

    const handleHoverOut = (event: MouseEvent): void =>
        processState('enabled', {callback: () => onHoverOut?.(event)});

    const handleFocus = (event: NativeSyntheticEvent<TargetedEvent>): void =>
        processState('focused', {callback: () => onFocus?.(event)});

    const handleBlur = (event: NativeSyntheticEvent<TargetedEvent>): void =>
        processState('enabled', {callback: () => onBlur?.(event)});

    const ripples = Object.entries(rippleSequence).map(([sequence, {touchableEvent}]) => (
        <Ripple
            key={`ripple_${sequence}`}
            sequence={sequence}
            underlayColor={underlayColor}
            touchableLayout={layout}
            touchableEvent={touchableEvent}
            onAnimatedEnd={processRippleAnimatedEnd}
        />
    ));

    const hoveredProps = {
        underlayColor,
        width: layout.width,
        height: layout.height,
        disabled,
        state:
            state === 'hovered' || state === 'focused' || state === 'enabled' ? state : undefined,
    };

    const touchableRipple = render({
        ...args,
        id,
        hoveredProps,
        children: (
            <>
                {children}
                {ripples}
            </>
        ),
        onLayout: processLayout,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
        onFocus: handleFocus,
        onBlur: handleBlur,
    });

    useEffect(() => {
        if (state === 'hovered') {
            processRippleOut();
        }
    }, [processRippleOut, state]);

    useEffect(() => {
        if (disabled) {
            setState(() => 'disabled');
        }
    }, [disabled, setState]);

    return touchableRipple;
};
