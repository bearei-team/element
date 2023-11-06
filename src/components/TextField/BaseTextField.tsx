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
    trailingIconStyle: Animated.WithAnimatedObject<ViewStyle>;
    trailingIconShow: boolean;
    inputRef: React.RefObject<TextInput>;
    hoveredProps?: HoveredProps;
    onPress: (event: GestureResponderEvent) => void;
    onTailingIconPress: (event: GestureResponderEvent) => void;
    onMainLayout: (event: LayoutChangeEvent) => void;
}

export interface ProcessAnimatedTimingOptions {
    animatedValue: Animated.Value;
    finished?: () => void;
}

export interface BaseTextFieldProps extends TextFieldProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseTextField: FC<BaseTextFieldProps> = ({
    render,
    onBlur,
    onChangeText,
    ref,
    type = 'filled',
    trailingIcon = <Text>{'X'}</Text>,
    disabled,
    ...renderProps
}) => {
    const id = useId();
    const theme = useTheme();
    const [state, setState] = useImmer<State>('enabled');
    const [mainLayout, setMainLayout] = useImmer({} as RippleProps['touchableLayout']);
    const textFieldRef = useRef<TextInput>(null);
    const [value, setValue] = useImmer('');
    const [trailingIconShow, setTrailingIconShow] = useImmer(false);
    const [focusedAnimated] = useAnimatedValue(0);
    const [trailingIconAnimated] = useAnimatedValue(0);
    const inputRef = (ref ?? textFieldRef) as RefObject<TextInput>;
    const mobile = theme.OS === 'ios' || theme.OS === 'android';
    const inputHeight = focusedAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 24, 24],
    });

    const labelSize = focusedAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [
            theme.typography.body.large.size,
            theme.typography.label.small.size,
            theme.typography.label.small.size,
        ],
    });

    const labelLineHeight = focusedAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [
            theme.typography.body.large.lineHeight,
            theme.typography.label.small.lineHeight,
            theme.typography.label.small.lineHeight,
        ],
    });

    const labelLineLetterSpacing = focusedAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [
            theme.typography.body.large.letterSpacing,
            theme.typography.label.small.letterSpacing,
            theme.typography.label.small.letterSpacing,
        ],
    });

    const labelColor = focusedAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [
            theme.palette.surface.onSurfaceVariant,
            theme.palette.primary.primary,
            theme.palette.error.error,
        ],
    });

    const activeIndicatorHeight = focusedAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [1, 2, 2],
    });

    const activeIndicatorColor = focusedAnimated.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [
            theme.palette.surface.onSurfaceVariant,
            theme.palette.primary.primary,
            theme.palette.error.error,
        ],
    });

    const trailingIconOpacity = trailingIconAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const processMainLayout = (event: LayoutChangeEvent) => {
        const {width, height} = event.nativeEvent.layout;

        setMainLayout(() => ({width, height}));
    };

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

    const handlePress = () =>
        processAnimatedTiming(1, {
            animatedValue: focusedAnimated,
            finished: () => inputRef.current?.focus(),
        });

    const handleBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
        onBlur?.(event);

        if (!value) {
            processAnimatedTiming(0, {animatedValue: focusedAnimated});
        }
    };

    const handleChangeText = (text: string) => {
        onChangeText?.(text);
        setValue(() => text);
    };

    const handleTailingIconPress = () => {
        setValue(() => '');
        inputRef.current?.focus();
    };

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
        if (disabled) {
            setState(() => 'disabled');
        }
    }, [disabled, setState]);

    return render({
        ...renderProps,
        ...(!mobile && {
            hoveredProps: {
                underlayColor: theme.palette.surface.onSurface,
                width: mainLayout.width,
                height: mainLayout.height,
                disabled,
                shapeProps: {shape: 'extraSmallTop'},
                state:
                    state === 'hovered' || state === 'focused' || state === 'enabled'
                        ? state
                        : undefined,
            },
        }),
        type,
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
        inputRef,
        inputStyle: {height: inputHeight},
        value,
        trailingIconStyle: {opacity: trailingIconOpacity},
        trailingIconShow,
        onChangeText: handleChangeText,
        onPress: handlePress,
        onBlur: handleBlur,
        onTailingIconPress: handleTailingIconPress,
        onMainLayout: processMainLayout,
        id,
    });
};
