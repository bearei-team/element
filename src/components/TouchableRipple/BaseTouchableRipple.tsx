import {FC, ReactNode, useCallback, useEffect, useId} from 'react';
import {
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    NativeTouchEvent,
    PressableProps,
    ViewProps,
} from 'react-native';
import {useImmer} from 'use-immer';
import {BaseRippleProps} from './Ripple/BaseRipple';
import {Ripple} from './Ripple/Ripple';
import {ulid} from 'ulid';

export interface TouchableRippleProps
    extends Omit<PressableProps & Pick<BaseRippleProps, 'underlayColor' | 'centered'>, 'children'> {
    children?: ReactNode;
}

export type RenderTouchableRippleContainerProps = TouchableRippleProps;
export type RenderTouchableRippleMainProps = ViewProps;
export interface BaseTouchableRippleProps extends TouchableRippleProps {
    renderMain: (props: RenderTouchableRippleMainProps) => React.JSX.Element;
    renderContainer: (props: RenderTouchableRippleContainerProps) => React.JSX.Element;
}

export type Ripple = {
    touchableEvent: NativeTouchEvent;
    animationOut?: (finished: () => void) => number;
};

export type RippleSequence = Record<string, Ripple>;

export const BaseTouchableRipple: FC<BaseTouchableRippleProps> = ({
    onPressIn,
    onPressOut,
    onLayout,
    renderMain,
    renderContainer,
    underlayColor,
    ...args
}) => {
    const id = useId();
    const [state, setState] = useImmer('out');
    const [layout, setLayout] = useImmer({} as LayoutRectangle);
    const [ripple, setRipple] = useImmer<RippleSequence>({});
    const processLayout = (event: LayoutChangeEvent): void => {
        onLayout?.(event);
        setLayout(() => event.nativeEvent.layout);
    };

    const processRippleAnimationEnd = useCallback(
        (sequence: string, animationOut: (finished: () => void) => void): void => {
            setRipple(draft => {
                draft[sequence].animationOut = animationOut;
            });
        },
        [setRipple],
    );

    const processRippleOut = useCallback((): void => {
        const rippleOut = ([sequence, {animationOut}]: [string, Ripple]) =>
            animationOut?.(() =>
                setRipple(draft => {
                    delete draft[sequence];
                }),
            );

        Object.entries(ripple).forEach(rippleOut);
    }, [ripple, setRipple]);

    const handlePressIn = (event: GestureResponderEvent): void => {
        onPressIn?.(event);

        setRipple(draft => {
            draft[ulid()] = {touchableEvent: event.nativeEvent, animationOut: undefined};
        });

        setState(() => 'in');
    };

    const handlePressOut = (event: GestureResponderEvent): void => {
        onPressOut?.(event);

        setState(() => 'out');
    };

    const ripples = Object.entries(ripple).map(([sequence, {touchableEvent}]) => (
        <Ripple
            key={`ripple_${sequence}`}
            sequence={sequence}
            underlayColor={underlayColor}
            touchableLayout={layout}
            touchableEvent={touchableEvent}
            onAnimationEnd={processRippleAnimationEnd}
        />
    ));

    const main = renderMain({id, children: ripples});
    const container = renderContainer({
        ...args,
        id,
        children: main,
        onLayout: processLayout,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
    });

    useEffect(() => {
        if (state === 'out') {
            processRippleOut();
        }
    }, [processRippleOut, ripple, setRipple, state]);

    return container;
};
