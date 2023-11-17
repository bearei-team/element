import {FC, RefObject, useCallback, useEffect, useId, useRef} from 'react';
import {
    Animated,
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    MouseEvent,
    NativeSyntheticEvent,
    Text,
    TextInput,
    TextInputFocusEventData,
    ViewStyle,
} from 'react-native';
import {useImmer} from 'use-immer';
import {AnimatedInterpolation, State} from '../Common/interface';
import {TextFieldProps} from './TextField';
import {ProcessAnimatedTimingOptions, useAnimated} from './useAnimated';
import {useUnderlayColor} from './useUnderlayColor';

export interface RenderProps extends TextFieldProps {
    inputRef: React.RefObject<TextInput>;
    inputState: State;
    onHoverIn: (event: MouseEvent) => void;
    onHoverOut: (event: MouseEvent) => void;
    onPress: (event: GestureResponderEvent) => void;
    state: State;
    trailingIconShow: boolean;
    underlayColor: string;
    renderStyle: Animated.WithAnimatedObject<
        ViewStyle & {
            activeIndicatorColor: AnimatedInterpolation;
            activeIndicatorHeight: AnimatedInterpolation;
            inputHeight: AnimatedInterpolation;
            labelColor: AnimatedInterpolation;
            labelLineHeight: AnimatedInterpolation;
            labelLineLetterSpacing: AnimatedInterpolation;
            labelSize: AnimatedInterpolation;
            supportingTextColor: AnimatedInterpolation;
        }
    > & {
        height: number;
        width: number;
    };
}

export interface ProcessStateOptions extends Pick<ProcessAnimatedTimingOptions, 'finished'> {
    element?: 'input' | 'container';
    filled?: boolean;
}

export interface BaseTextFieldProps extends TextFieldProps {
    render: (props: RenderProps) => React.JSX.Element;
}

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
    trailingIcon = <Text>{'X'}</Text>,
    type = 'filled',
    ...renderProps
}) => {
    const [inputState, setInputState] = useImmer<State>('enabled');
    const [layout, setLayout] = useImmer({} as Pick<LayoutRectangle, 'height' | 'width'>);
    const [state, setState] = useImmer<State>('enabled');
    const [trailingIconShow, setTrailingIconShow] = useImmer(false);
    const [underlayColor] = useUnderlayColor({type});
    const [value, setValue] = useImmer('');
    const {onAnimated, ...animatedStyle} = useAnimated({filled: !!value || !!placeholder});
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
                return onAnimated(nextState);
            }

            processState(state);
            processState(inputState, {element: 'input'});
        },
        [inputState, onAnimated, processState, state],
    );

    const processLayout = (event: LayoutChangeEvent) => {
        const {height, width} = event.nativeEvent.layout;

        setLayout(() => ({height, width}));
        onLayout?.(event);
    };

    const handlePress = () =>
        processState('pressed', {
            finished: () => {
                inputRef.current?.focus();
                setState(draft => (draft !== 'enabled' ? 'hovered' : undefined));
            },
        });

    const handleFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
        processState('focused', {element: 'input'});
        onFocus?.(event);
    };

    const handleBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
        if (state === 'enabled') {
            processState('enabled', {element: 'input'});
        }

        onBlur?.(event);
    };

    const handleHoverIn = () => processState('hovered');
    const handleHoverOut = () => processState('enabled');
    const handleChangeText = (text: string) => {
        setValue(() => text);
        onChangeText?.(text);
    };

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
        onBlur: handleBlur,
        onChangeText: handleChangeText,
        onFocus: handleFocus,
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
        onLayout: processLayout,
        onPress: handlePress,
        placeholder,
        renderStyle: {...animatedStyle, height: layout.height, width: layout.width},
        shape: 'extraSmallTop',
        state,
        trailingIcon,
        trailingIconShow,
        type,
        underlayColor,
        value,
    });
};
