import {FC, useCallback, useEffect, useId} from 'react';
import {
    GestureResponderEvent,
    LayoutChangeEvent,
    MouseEvent,
    NativeSyntheticEvent,
    TargetedEvent,
} from 'react-native';
import {useImmer} from 'use-immer';
import {Ripple, RippleAnimatedOut, RippleProps} from './Ripple/Ripple';
import {TouchableRippleProps} from './TouchableRipple';
import {State} from '../common/interface';

export type RenderProps = Omit<TouchableRippleProps, 'centered'> & {hoveredProps: any};
export interface BaseTouchableRippleProps extends TouchableRippleProps {
    render: (props: RenderProps) => React.JSX.Element;
}
export interface Ripple extends Pick<RippleProps, 'location'> {
    animatedOut?: RippleAnimatedOut;
}
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
    ...renderProps
}) => {
    const id = useId();
    const [state, setState] = useImmer<State>('enabled');
    const [layout, setLayout] = useImmer({} as RippleProps['touchableLayout']);
    const [rippleSequence, setRippleSequence] = useImmer<RippleSequence>({});
    const processPressed = (event: GestureResponderEvent) => {
        const {locationX, locationY} = event.nativeEvent;

        setRippleSequence(draft => {
            draft[`${Date.now()}`] = {
                location: {locationX, locationY},
                animatedOut: undefined,
            };
        });
    };

    const processState = (nextState: State, {event, callback}: ProcessStateOptions) => {
        if (state !== 'disabled') {
            if (nextState === 'pressed' && event) {
                processPressed(event);
            }

            setState(() => nextState);
            callback?.();
        }
    };

    const processLayout = (event: LayoutChangeEvent) => {
        const {width, height} = event.nativeEvent.layout;

        setLayout(() => ({width, height}));
        onLayout?.(event);
    };

    const processRippleAnimatedEnd = useCallback(
        (sequence: string, animatedOut: RippleAnimatedOut) => {
            setRippleSequence(draft => {
                if (draft[sequence]) {
                    draft[sequence].animatedOut = animatedOut;
                }
            });
        },
        [setRippleSequence],
    );

    const processRippleOut = useCallback(() => {
        const rippleOut = ([sequence, {animatedOut}]: [string, Ripple]): number | undefined =>
            animatedOut?.(() =>
                setRippleSequence(draft => {
                    delete draft[sequence];
                }),
            );

        Object.entries(rippleSequence).forEach(rippleOut);
    }, [rippleSequence, setRippleSequence]);

    const handlePressIn = (event: GestureResponderEvent) =>
        processState('pressed', {event, callback: () => onPressIn?.(event)});

    const handlePressOut = (event: GestureResponderEvent) =>
        processState('hovered', {callback: () => onPressOut?.(event)});

    const handleHoverIn = (event: MouseEvent) =>
        processState('hovered', {callback: () => onHoverIn?.(event)});

    const handleHoverOut = (event: MouseEvent) =>
        processState('enabled', {callback: () => onHoverOut?.(event)});

    const handleFocus = (event: NativeSyntheticEvent<TargetedEvent>) =>
        processState('focused', {callback: () => onFocus?.(event)});

    const handleBlur = (event: NativeSyntheticEvent<TargetedEvent>) =>
        processState('enabled', {callback: () => onBlur?.(event)});

    const ripples = Object.entries(rippleSequence).map(([sequence, {location}]) => (
        <Ripple
            key={`ripple_${sequence}`}
            sequence={sequence}
            underlayColor={underlayColor}
            touchableLayout={layout}
            location={location}
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
        ...renderProps,
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
