import {FC, RefObject, useCallback, useEffect, useId, useRef} from 'react';
import {TextFieldProps} from './TextField';
import {useAnimatedValue} from '../../hooks/useAnimatedValue';
import {
    Animated,
    GestureResponderEvent,
    LayoutChangeEvent,
    NativeSyntheticEvent,
    Text,
    TextInput,
    TextInputFocusEventData,
    TextStyle,
    ViewStyle,
    MouseEvent,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {UTIL} from '../../utils/util';
import {useImmer} from 'use-immer';
import {State} from '../common/interface';
import {RippleProps} from '../TouchableRipple/Ripple/Ripple';
import {HoveredProps} from '../Hovered/Hovered';

export interface RenderProps extends TextFieldProps {
    labelStyle: Animated.WithAnimatedObject<TextStyle>;
    inputStyle: Animated.WithAnimatedObject<TextStyle>;
    activeIndicatorStyle: Animated.WithAnimatedObject<ViewStyle>;
    supportingTextStyle: Animated.WithAnimatedObject<TextStyle>;
    trailingIconStyle: Animated.WithAnimatedObject<ViewStyle>;
    trailingIconShow: boolean;
    inputRef: React.RefObject<TextInput>;
    hoveredProps?: HoveredProps;
    mainLayout: RippleProps['touchableLayout'];
    onPress: (event: GestureResponderEvent) => void;
    onHoverIn: (event: MouseEvent) => void;
    onHoverOut: (event: MouseEvent) => void;
    onTailingIconPress: (event: GestureResponderEvent) => void;
    onMainLayout: (event: LayoutChangeEvent) => void;
}

export interface ProcessAnimatedTimingOptions {
    animatedValue: Animated.Value;
    finished?: () => void;
}

export interface ProcessStateOptions {
    element: 'input' | 'container';
}

export interface BaseTextFieldProps extends TextFieldProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseTextField: FC<BaseTextFieldProps> = ({
    render,
    onBlur,
    onFocus,
    onChangeText,
    ref,
    type = 'filled',
    trailingIcon = <Text>{'X'}</Text>,
    disabled,
    error,
    ...renderProps
}) => {
    const id = useId();
    const theme = useTheme();
    const textFieldRef = useRef<TextInput>(null);
    const [state, setState] = useImmer<State>('enabled');
    const [inputState, setInputState] = useImmer<State>('enabled');
    const [mainLayout, setMainLayout] = useImmer({} as RippleProps['touchableLayout']);
    const [value, setValue] = useImmer('');
    const [trailingIconShow, setTrailingIconShow] = useImmer(false);
    const [labeAnimated] = useAnimatedValue(0);
    const [inputAnimated] = useAnimatedValue(0);
    const [trailingIconAnimated] = useAnimatedValue(0);
    const [activeIndicatorAnimated] = useAnimatedValue(0);
    const [supportingTextAnimated] = useAnimatedValue(0);
    const inputRef = (ref ?? textFieldRef) as RefObject<TextInput>;
    const mobile = theme.OS === 'ios' || theme.OS === 'android';
    const {palette, typography, color} = theme;
    const disabledColor = color.rgba(palette.surface.onSurface, 0.38);
    const colorRange = error
        ? [palette.error.error, palette.error.error, disabledColor]
        : [palette.surface.onSurfaceVariant, palette.primary.primary, disabledColor];

    const inputHeight = inputAnimated.interpolate({inputRange: [0, 1], outputRange: [0, 24]});
    const labelSize = labeAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [
            typography.body.large.size,
            typography.body.large.size,
            typography.label.small.size,
        ],
    });

    const labelLineHeight = labeAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [
            typography.body.large.lineHeight,
            typography.body.large.lineHeight,
            typography.label.small.lineHeight,
        ],
    });

    const labelLineLetterSpacing = labeAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [
            typography.body.large.letterSpacing,
            typography.body.large.letterSpacing,
            typography.label.small.letterSpacing,
        ],
    });

    const labelColor = labeAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: colorRange,
    });

    const activeIndicatorHeight = activeIndicatorAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [error ? 2 : 1, 2, 2],
    });

    const activeIndicatorColor = activeIndicatorAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: colorRange,
    });

    const trailingIconOpacity = trailingIconAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const supportingTextOpacity = supportingTextAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const processAnimatedTiming = useCallback(
        (toValue: number, {animatedValue, finished}: ProcessAnimatedTimingOptions) => {
            const animatedTiming = UTIL.animatedTiming(theme);
            const animated = () =>
                requestAnimationFrame(() =>
                    animatedTiming(animatedValue, {
                        toValue,
                        easing: 'standard',
                        duration: 'short3',
                    }).start(finished),
                );

            animated();
        },
        [theme],
    );

    const processStateAnimated = useCallback(
        (nextState: State, {element}: ProcessStateOptions) => {
            const stateAnimated = {
                enabled: () => {
                    if (element === 'input') {
                        processAnimatedTiming(0, {animatedValue: labeAnimated});
                        processAnimatedTiming(0, {animatedValue: activeIndicatorAnimated});
                    }

                    setState(a => {
                        if (a === 'error') {
                            processAnimatedTiming(0, {animatedValue: supportingTextAnimated});
                        }
                    });
                },

                pressed: () => {
                    processAnimatedTiming(1, {animatedValue: labeAnimated});
                    processAnimatedTiming(1, {
                        animatedValue: activeIndicatorAnimated,
                        finished: () => inputRef.current?.focus(),
                    });
                },

                error: () =>
                    setInputState(a => {
                        processAnimatedTiming(a === 'focused' ? 2 : 0, {
                            animatedValue: labeAnimated,
                        });

                        processAnimatedTiming(2, {animatedValue: activeIndicatorAnimated});
                        processAnimatedTiming(1, {animatedValue: supportingTextAnimated});
                    }),

                disabled: () => {
                    processAnimatedTiming(3, {animatedValue: labeAnimated});
                    processAnimatedTiming(3, {animatedValue: activeIndicatorAnimated});
                },

                hovered: undefined,
                focused: undefined,
            };

            stateAnimated[nextState]?.();
        },
        [
            activeIndicatorAnimated,
            inputRef,
            labeAnimated,
            processAnimatedTiming,
            setInputState,
            setState,
            supportingTextAnimated,
        ],
    );

    const processState = useCallback(
        (nextState: State, {element}: ProcessStateOptions) => {
            element === 'input' ? setInputState(() => nextState) : setState(() => nextState);

            processStateAnimated(nextState, {element});
        },
        [processStateAnimated, setInputState, setState],
    );

    const processMainLayout = (event: LayoutChangeEvent) => {
        const {width, height} = event.nativeEvent.layout;

        setMainLayout(() => ({width, height}));
    };

    const handlePress = () => {
        if (inputState !== 'focused') {
            processState('pressed', {element: 'container'});
        }
    };

    const handleFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
        processState('focused', {element: 'input'});
        onFocus?.(event);
    };

    const handleBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
        if (state !== 'enabled') {
            return inputRef.current?.focus();
        }

        processState('enabled', {element: 'input'});
        onBlur?.(event);
    };

    const handleChangeText = (text: string) => {
        setValue(() => text);
        onChangeText?.(text);
    };

    const handleTailingIconPress = () => {
        inputRef.current?.focus();
        setValue(() => '');
    };

    const handleHoverIn = () => processState('hovered', {element: 'container'});
    const handleHoverOut = () => processState('enabled', {element: 'container'});

    useEffect(() => {
        const show = !!value;

        if (show) {
            setTrailingIconShow(() => show);
            processAnimatedTiming(1, {animatedValue: trailingIconAnimated});
        } else {
            processAnimatedTiming(0, {
                animatedValue: trailingIconAnimated,
                finished: () => setTrailingIconShow(() => show),
            });
        }
    }, [processAnimatedTiming, setTrailingIconShow, trailingIconAnimated, value]);

    useEffect(() => {
        if (typeof disabled === 'boolean') {
            processState(disabled ? 'disabled' : 'enabled', {element: 'container'});
        }
    }, [disabled, processState]);

    useEffect(() => {
        if (error && !disabled) {
            processState('error', {element: 'container'});
        }
    }, [processState, error, disabled]);

    return render({
        ...renderProps,
        ...(!mobile && {
            hoveredProps: {
                underlayColor: palette.surface.onSurface,
                width: mainLayout.width,
                height: mainLayout.height,
                disabled,
                shapeProps: {shape: 'extraSmallTop'},
                state:
                    state === 'hovered' || state === 'focused' || state === 'enabled'
                        ? inputState === 'focused'
                            ? 'enabled'
                            : state
                        : undefined,
            },
        }),
        disabled,
        mainLayout,
        type,
        error,
        trailingIcon,
        activeIndicatorStyle: {
            backgroundColor: activeIndicatorColor,
            height: activeIndicatorHeight,
        },
        labelStyle: {
            fontSize: labelSize,
            lineHeight: labelLineHeight,
            letterSpacing: labelLineLetterSpacing,
            color: labelColor,
        },
        supportingTextStyle: {
            opacity: supportingTextOpacity,
        },
        inputRef,
        inputStyle: {height: inputHeight},
        value,
        trailingIconStyle: {opacity: trailingIconOpacity},
        trailingIconShow,
        onChangeText: handleChangeText,
        onPress: handlePress,
        onBlur: handleBlur,
        onFocus: handleFocus,
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
        onTailingIconPress: handleTailingIconPress,
        onMainLayout: processMainLayout,
        id,
    });
};
