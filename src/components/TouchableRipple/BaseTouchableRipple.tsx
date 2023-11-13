import {FC, useCallback, useEffect, useId} from 'react';
import {
    GestureResponderEvent,
    LayoutChangeEvent,
    MouseEvent,
    NativeSyntheticEvent,
    TargetedEvent,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useImmer} from 'use-immer';
import {State} from '../common/interface';
import {Ripple, RippleAnimatedOut, RippleProps} from './Ripple/Ripple';
import {TouchableRippleProps} from './TouchableRipple';

export type RenderProps = Omit<TouchableRippleProps, 'centered'>;
export interface BaseTouchableRippleProps extends TouchableRippleProps {
    render: (props: RenderProps) => React.JSX.Element;
}
export interface Ripple extends Pick<RippleProps, 'location'> {
    animatedOut?: RippleAnimatedOut;
}
export interface ProcessStateOptions {
    event?: GestureResponderEvent;
    callback?: () => void;
}

export type RippleSequence = Record<string, Ripple>;
export type RenderRipplesOptions = Pick<
    RippleProps,
    'underlayColor' | 'touchableLayout' | 'onAnimatedEnd'
>;

const renderRipples = (rippleSequence: RippleSequence, options: RenderRipplesOptions) =>
    Object.entries(rippleSequence).map(([sequence, {location}]) => (
        <Ripple {...options} key={`ripple_${sequence}`} sequence={sequence} location={location} />
    ));

export const BaseTouchableRipple: FC<BaseTouchableRippleProps> = ({
    children,
    disabled = false,
    onBlur,
    onFocus,
    onHoverIn,
    onHoverOut,
    onLayout,
    onPressIn,
    onPressOut,
    render,
    underlayColor,
    ...renderProps
}) => {
    const id = useId();
    const theme = useTheme();
    const [state, setState] = useImmer<State>('enabled');
    const [layout, setLayout] = useImmer({} as RippleProps['touchableLayout']);
    const [rippleSequence, setRippleSequence] = useImmer<RippleSequence>({});
    const mobile = theme.OS === 'ios' || theme.OS === 'android';
    const processPressed = (event: GestureResponderEvent) => {
        const {locationX, locationY} = event.nativeEvent;

        setRippleSequence(draft => {
            draft[`${Date.now()}`] = {
                animatedOut: undefined,
                location: {locationX, locationY},
            };
        });
    };

    const processState = (nextState: State, {event, callback}: ProcessStateOptions) => {
        if (state !== 'disabled') {
            nextState === 'pressed' && event && processPressed(event);

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
        const rippleOut = ([sequence, {animatedOut}]: [string, Ripple]) =>
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
        processState(mobile ? 'enabled' : 'hovered', {callback: () => onPressOut?.(event)});

    const handleHoverIn = (event: MouseEvent) =>
        processState('hovered', {callback: () => onHoverIn?.(event)});

    const handleHoverOut = (event: MouseEvent) =>
        processState('enabled', {callback: () => onHoverOut?.(event)});

    const handleFocus = (event: NativeSyntheticEvent<TargetedEvent>) =>
        processState('focused', {callback: () => onFocus?.(event)});

    const handleBlur = (event: NativeSyntheticEvent<TargetedEvent>) =>
        processState('enabled', {callback: () => onBlur?.(event)});

    useEffect(() => {
        mobile
            ? state === 'enabled' && processRippleOut()
            : state === 'hovered' && processRippleOut();
    }, [mobile, processRippleOut, state]);

    useEffect(() => {
        if (disabled) {
            setState(() => 'disabled');
        }
    }, [disabled, setState]);

    return render({
        ...renderProps,
        children: (
            <>
                {children}
                {renderRipples(rippleSequence, {
                    onAnimatedEnd: processRippleAnimatedEnd,
                    touchableLayout: layout,
                    underlayColor,
                })}
            </>
        ),
        id,
        onBlur: handleBlur,
        onFocus: handleFocus,
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
        onLayout: processLayout,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
    });
};
