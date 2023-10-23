import {FC, useCallback, useEffect, useId} from 'react';
import {
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    NativeTouchEvent,
} from 'react-native';
import {useImmer} from 'use-immer';
import {Ripple, RippleAnimatedOut} from './Ripple/Ripple';
import {ulid} from 'ulid';
import {TouchableRippleProps} from './TouchableRipple';

export type RenderProps = Omit<TouchableRippleProps, 'centered'>;
export interface BaseTouchableRippleProps extends TouchableRippleProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export type Ripple = {
    touchableEvent: NativeTouchEvent;
    animatedOut?: RippleAnimatedOut;
};

export type RippleSequence = Record<string, Ripple>;
export const BaseTouchableRipple: FC<BaseTouchableRippleProps> = ({
    onPressIn,
    onPressOut,
    onLayout,
    render,
    children,
    underlayColor,
    ...args
}): React.JSX.Element => {
    const id = useId();
    const [state, setState] = useImmer<'pressIn' | 'pressOut'>('pressOut');
    const [layout, setLayout] = useImmer({} as LayoutRectangle);
    const [rippleSequence, setRippleSequence] = useImmer<RippleSequence>({});
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

    const handlePressIn = (event: GestureResponderEvent): void => {
        onPressIn?.(event);
        setRippleSequence(draft => {
            draft[ulid()] = {touchableEvent: event.nativeEvent, animatedOut: undefined};
        });

        setState(() => 'pressIn');
    };

    const handlePressOut = (event: GestureResponderEvent): void => {
        onPressOut?.(event);
        setState(() => 'pressOut');
    };

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

    const touchableRipple = render({
        ...args,
        id,
        children: (
            <>
                {children}
                {ripples}
            </>
        ),
        onLayout: processLayout,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
    });

    useEffect(() => {
        if (state === 'pressOut') {
            processRippleOut();
        }
    }, [processRippleOut, state]);

    return touchableRipple;
};
