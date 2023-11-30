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
import {State} from '../Common/interface';
import {Ripple, RippleAnimatedOut, RippleProps} from './Ripple/Ripple';
import {TouchableRippleProps} from './TouchableRipple';

export type RenderProps = Omit<TouchableRippleProps, 'centered'>;
export interface TouchableRippleBaseProps extends TouchableRippleProps {
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
export type RenderRipplesOptions = Pick<
    RippleProps,
    'underlayColor' | 'touchableLayout' | 'onAnimatedEnd'
>;

const renderRipples = (rippleSequence: RippleSequence, options: RenderRipplesOptions) =>
    Object.entries(rippleSequence).map(([sequence, {location}]) => (
        <Ripple {...options} key={`ripple_${sequence}`} location={location} sequence={sequence} />
    ));

export const TouchableRippleBase: FC<TouchableRippleBaseProps> = Props => {
    const {
        children,
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
    } = Props;

    const [layout, setLayout] = useImmer({} as RippleProps['touchableLayout']);
    const [rippleSequence, setRippleSequence] = useImmer<RippleSequence>({});
    const [state, setState] = useImmer<State>('enabled');
    const id = useId();
    const theme = useTheme();
    const mobile = ['ios', 'android'].includes(theme.OS);

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
        nextState === 'pressed' && event && processPressed(event);

        setState(() => nextState);
        callback?.();
    };

    const processLayout = (event: LayoutChangeEvent) => {
        const {height, width} = event.nativeEvent.layout;

        setLayout(() => ({height, width}));
        onLayout?.(event);
    };

    const processRippleOut = useCallback(() => {
        const rippleOut = ([sequence, {animatedOut}]: [string, Ripple]) =>
            animatedOut?.(() =>
                setRippleSequence(draft => {
                    delete draft[sequence];
                }),
            );

        Object.entries(rippleSequence).forEach(rippleOut);
    }, [rippleSequence, setRippleSequence]);

    const processRippleAnimatedEnd = useCallback(
        (sequence: string, animatedOut: RippleAnimatedOut) => {
            setState(curState => {
                curState === 'enabled'
                    ? animatedOut(() =>
                          setRippleSequence(draft => {
                              delete draft[sequence];
                          }),
                      )
                    : setRippleSequence(draft => {
                          draft[sequence] && (draft[sequence].animatedOut = animatedOut);
                      });
            });
        },
        [setRippleSequence, setState],
    );

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

    const childrenElement = (
        <>
            {children}
            {renderRipples(rippleSequence, {
                onAnimatedEnd: processRippleAnimatedEnd,
                touchableLayout: layout,
                underlayColor,
            })}
        </>
    );

    useEffect(() => {
        if (Object.keys(rippleSequence).length !== 0) {
            mobile
                ? state === 'enabled' && processRippleOut()
                : state === 'hovered' && processRippleOut();
        }
    }, [mobile, processRippleOut, rippleSequence, state]);

    return render({
        ...renderProps,
        children: childrenElement,
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
