import {FC, RefObject, useCallback, useEffect, useId, useMemo, useRef} from 'react';
import {
    Animated,
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    MouseEvent,
    NativeSyntheticEvent,
    TextInput,
    TextInputFocusEventData,
    ViewStyle,
} from 'react-native';
import {useImmer} from 'use-immer';
import {AnimatedInterpolation, State} from '../Common/interface';
import {TextFieldProps} from './TextField';
import {Input} from './TextField.styles';
import {ProcessAnimatedTimingOptions, useAnimated} from './useAnimated';
import {useUnderlayColor} from './useUnderlayColor';

export interface RenderProps extends TextFieldProps {
    inputRef: React.RefObject<TextInput>;
    inputState: State;
    onHoverIn: (event: MouseEvent) => void;
    onHoverOut: (event: MouseEvent) => void;
    onLabelPlaceholderTextLayout: (event: LayoutChangeEvent) => void;
    onPress: (event: GestureResponderEvent) => void;
    renderStyle: Animated.WithAnimatedObject<
        ViewStyle & {
            activeIndicatorColor: AnimatedInterpolation;
            activeIndicatorHeight: AnimatedInterpolation;
            // inputHeight: AnimatedInterpolation;
            labelColor: AnimatedInterpolation;
            labelLeft?: AnimatedInterpolation;
            labelLineHeight: AnimatedInterpolation;
            labelLineLetterSpacing: AnimatedInterpolation;
            LabelPlaceholderFixWidth?: AnimatedInterpolation;
            labelSize: AnimatedInterpolation;
            labelTop?: AnimatedInterpolation;
            supportingTextColor: AnimatedInterpolation;
            supportingTextOpacity: AnimatedInterpolation;
        }
    > & {
        height: number;
        labelPlaceholderHeight: number;
        labelPlaceholderWidth: number;
        width: number;
    };
    state: State;
    underlayColor: string;
}

export interface ProcessStateOptions extends Pick<ProcessAnimatedTimingOptions, 'finished'> {
    element?: 'input' | 'container';
    filled?: boolean;
}

export interface BaseTextFieldProps extends TextFieldProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const AnimatedTextInput = Animated.createAnimatedComponent(Input);
export const BaseTextField: FC<BaseTextFieldProps> = ({
    disabled,
    error,
    leadingIcon,
    onBlur,
    onChangeText,
    onFocus,
    onLayout,
    placeholder,
    ref,
    render,
    supportingText,
    trailingIcon,
    type = 'filled',
    ...renderProps
}) => {
    const [inputState, setInputState] = useImmer<State>('enabled');
    const [labelPlaceholderTextLayout, setLabelPlaceholderTextLayout] = useImmer(
        {} as Pick<LayoutRectangle, 'height' | 'width'>,
    );

    const [layout, setLayout] = useImmer({} as Pick<LayoutRectangle, 'height' | 'width'>);
    const [state, setState] = useImmer<State>('enabled');
    const [underlayColor] = useUnderlayColor({type});
    const [value, setValue] = useImmer('');
    const {onAnimated, inputHeight, ...animatedStyle} = useAnimated({
        filled: !!value || !!placeholder,
        labelPlaceholderWidth: labelPlaceholderTextLayout.width,
        supportingText,
        type,
    });

    const id = useId();
    const textFieldRef = useRef<TextInput>(null);
    const inputRef = (ref ?? textFieldRef) as RefObject<TextInput>;
    const processState = useCallback(
        (nextState: State, {element = 'container', finished}: ProcessStateOptions = {}) => {
            element === 'input' ? setInputState(() => nextState) : setState(() => nextState);

            onAnimated(nextState, {finished, input: element === 'input'});
        },

        [onAnimated, setInputState, setState],
    );

    const processAbnormalState = useCallback(
        (nextState: State, abnormalValue: boolean) => {
            if (abnormalValue) {
                return processState(nextState);
            }

            processState(state);
            processState(inputState, {element: 'input'});
        },
        [inputState, processState, state],
    );

    const processLayout = (event: LayoutChangeEvent) => {
        const {height, width} = event.nativeEvent.layout;

        setLayout(() => ({height, width}));
        onLayout?.(event);
    };

    const processLabelPlaceholderTextLayout = (event: LayoutChangeEvent) => {
        const {height, width} = event.nativeEvent.layout;

        setLabelPlaceholderTextLayout(() => ({height, width}));
    };

    const handlePress = () =>
        processState('pressed', {
            finished: () => {
                inputRef.current?.focus();
                setState(draft => (draft !== 'enabled' ? 'hovered' : undefined));
            },
        });

    const handleFocus = useCallback(
        (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
            processState('focused', {element: 'input'});
            onFocus?.(event);
        },
        [onFocus, processState],
    );

    const handleBlur = useCallback(
        (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
            if (state === 'enabled') {
                processState('enabled', {element: 'input'});
            }

            processState('enabled', {element: 'input'});

            onBlur?.(event);
        },
        [onBlur, processState, state],
    );

    const handleHoverIn = () => processState('hovered');
    const handleHoverOut = () => processState('enabled');
    const handleChangeText = useCallback(
        (text: string) => {
            setValue(() => text);
            onChangeText?.(text);
        },
        [onChangeText, setValue],
    );

    const children = useMemo(() => {
        return (
            <AnimatedTextInput
                // {...inputProps}
                onBlur={handleBlur}
                onChangeText={handleChangeText}
                onFocus={handleFocus}
                ref={inputRef}
                style={{height: inputHeight}}
                testID={`textfield__input--${id}`}
            />
        );
    }, [handleBlur, handleChangeText, handleFocus, id, inputHeight, inputRef]);

    useEffect(() => {
        if (typeof disabled === 'boolean') {
            processAbnormalState('disabled', disabled);
        }
    }, [disabled, processAbnormalState]);

    useEffect(() => {
        if (typeof error === 'boolean' && !disabled) {
            processAbnormalState('error', error);
        }
    }, [disabled, error, processAbnormalState]);

    return render({
        ...renderProps,
        disabled,
        id,
        inputRef,
        inputState,
        leadingIcon,
        // onBlur: handleBlur,
        // onChangeText: handleChangeText,
        // onFocus: handleFocus,
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
        onLabelPlaceholderTextLayout: processLabelPlaceholderTextLayout,
        onLayout: processLayout,
        onPress: handlePress,
        placeholder,
        children,
        renderStyle: {
            ...animatedStyle,
            height: layout.height,
            labelPlaceholderHeight: labelPlaceholderTextLayout.height,
            labelPlaceholderWidth: labelPlaceholderTextLayout.width,
            width: layout.width,
        },
        shape: type === 'filled' ? 'extraSmallTop' : 'extraSmall',
        state,
        supportingText,
        trailingIcon,
        type,
        underlayColor,
        value,
    });
};
