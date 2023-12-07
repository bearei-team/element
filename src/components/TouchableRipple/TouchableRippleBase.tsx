import {FC, useCallback, useEffect, useId} from 'react';
import {GestureResponderEvent, LayoutChangeEvent} from 'react-native';
import {useImmer} from 'use-immer';
import {ProcessStateOptions, useHandleEvent} from '../../hooks/useHandleEvent';
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

export type RippleSequence = Record<string, Ripple>;
export type RenderRipplesOptions = Pick<
    RippleProps,
    'underlayColor' | 'touchableLayout' | 'onAnimatedEnd'
>;

const renderRipples = (rippleSequence: RippleSequence, options: RenderRipplesOptions) =>
    Object.entries(rippleSequence).map(([sequence, {location}]) => (
        <Ripple {...options} key={`ripple_${sequence}`} location={location} sequence={sequence} />
    ));

export const TouchableRippleBase: FC<TouchableRippleBaseProps> = props => {
    const {children, onLayout, render, underlayColor, ...renderProps} = props;
    const [layout, setLayout] = useImmer({} as RippleProps['touchableLayout']);
    const [rippleSequence, setRippleSequence] = useImmer<RippleSequence>({});
    const id = useId();

    const processPressed = useCallback(
        (event: GestureResponderEvent) => {
            const {locationX, locationY} = event.nativeEvent;

            setRippleSequence(draft => {
                draft[`${Date.now()}`] = {
                    animatedOut: undefined,
                    location: {locationX, locationY},
                };
            });
        },
        [setRippleSequence],
    );

    const processState = useCallback(
        (nextState: State, options = {} as ProcessStateOptions) => {
            const {event} = options;

            nextState === 'pressIn' && processPressed(event as GestureResponderEvent);
        },
        [processPressed],
    );

    const {state, mobile, ...handleEvent} = useHandleEvent({
        ...props,
        onProcessState: processState,
    });

    const processLayout = (event: LayoutChangeEvent) => {
        const {height, width} = event.nativeEvent.layout;

        setLayout(() => ({height, width}));
        onLayout?.(event);
    };

    const processRippleOut = useCallback(() => {
        const rippleOut = (options: [string, Ripple]) => {
            const [sequence, {animatedOut}] = options;

            animatedOut?.(() =>
                setRippleSequence(draft => {
                    delete draft[sequence];
                }),
            );
        };
        Object.entries(rippleSequence).forEach(rippleOut);
    }, [rippleSequence, setRippleSequence]);

    const processRippleAnimatedEnd = useCallback(
        (sequence: string, animatedOut: RippleAnimatedOut) => {
            animatedOut(() =>
                setRippleSequence(draft => {
                    delete draft[sequence];
                }),
            );
        },
        [setRippleSequence],
    );

    const childrenElement = (
        <>
            {children}
            {typeof layout.width === 'number' &&
                renderRipples(rippleSequence, {
                    onAnimatedEnd: processRippleAnimatedEnd,
                    touchableLayout: layout,
                    underlayColor,
                })}
        </>
    );

    useEffect(() => {
        Object.keys(rippleSequence).length !== 0 && mobile
            ? state === 'enabled' && processRippleOut()
            : state === 'hovered' && processRippleOut();
    }, [mobile, processRippleOut, rippleSequence, state]);

    return render({
        ...renderProps,
        ...handleEvent,
        children: childrenElement,
        id,
        onLayout: processLayout,
    });
};
