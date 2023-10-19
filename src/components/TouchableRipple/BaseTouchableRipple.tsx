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
import {RippleAnimationOut, BaseRippleProps} from './Ripple/BaseRipple';
import {Ripple} from './Ripple/Ripple';
import {ulid} from 'ulid';

export interface TouchableRippleProps
    extends Omit<PressableProps & Pick<BaseRippleProps, 'underlayColor' | 'centered'>, 'children'> {
    children?: ReactNode;
}

export type RenderContainerProps = TouchableRippleProps;
export type RenderMainProps = ViewProps;
export interface BaseTouchableRippleProps extends TouchableRippleProps {
    renderMain: (props: RenderMainProps) => React.JSX.Element;
    renderContainer: (props: RenderContainerProps) => React.JSX.Element;
}

export type Ripple = {
    touchableEvent: NativeTouchEvent;
    animatedOut?: RippleAnimationOut;
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
}): React.JSX.Element => {
    const id = useId();
    const [state, setState] = useImmer<'pressIn' | 'pressOut'>('pressOut');
    const [layout, setLayout] = useImmer({} as LayoutRectangle);
    const [rippleSequence, setRippleSequence] = useImmer<RippleSequence>({});
    const processLayout = (event: LayoutChangeEvent): void => {
        onLayout?.(event);
        setLayout(() => event.nativeEvent.layout);
    };

    const processRippleAnimationEnd = useCallback(
        (sequence: string, animatedOut: RippleAnimationOut): void => {
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
        if (state === 'pressOut') {
            processRippleOut();
        }
    }, [processRippleOut, state]);

    return container;
};
