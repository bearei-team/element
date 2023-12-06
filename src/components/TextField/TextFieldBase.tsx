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
    inputState: State;
    onHoverIn: (event: MouseEvent) => void;
    onHoverOut: (event: MouseEvent) => void;
    onLabelTextLayout: (event: LayoutChangeEvent) => void;
    onCoreLayout: (event: LayoutChangeEvent) => void;
    onPress: (event: GestureResponderEvent) => void;
    renderStyle: Animated.WithAnimatedObject<
        ViewStyle & {
            activeIndicatorColor: AnimatedInterpolation;
            activeIndicatorHeight: AnimatedInterpolation;
            labelColor: AnimatedInterpolation;
            labelLeft?: AnimatedInterpolation;
            labelLineHeight: AnimatedInterpolation;
            labelLineLetterSpacing: AnimatedInterpolation;
            labelSize: AnimatedInterpolation;
            labelTop?: AnimatedInterpolation;
            labelTextBackgroundWidth?: AnimatedInterpolation;
            supportingTextColor: AnimatedInterpolation;
            supportingTextOpacity: AnimatedInterpolation;
        }
    > & {coreHeight: number; labelTextHeight: number; labelTextWidth: number; coreWidth: number};
    state: State;
    underlayColor: string;
}

export interface ProcessStateOptions extends Pick<ProcessAnimatedTimingOptions, 'finished'> {
    element?: 'input' | 'container';
    filled?: boolean;
}

export interface TextFieldBaseProps extends TextFieldProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export type RenderTextInputOptions = TextFieldProps;

const initialState = {
    inputState: 'enabled' as State,
    labelTextLayout: {} as Pick<LayoutRectangle, 'height' | 'width'>,
    coreLayout: {} as Pick<LayoutRectangle, 'height' | 'width'>,
    state: 'enabled' as State,
    underlayColor: '',
    value: '',
};

const AnimatedTextInput = Animated.createAnimatedComponent(Input);
const renderTextInput = (options: RenderTextInputOptions) => <AnimatedTextInput {...options} />;
export const TextFieldBase: FC<TextFieldBaseProps> = props => {
    const {
        defaultValue,
        disabled,
        error,
        labelText = 'Label',
        leadingIcon,
        onBlur,
        onChangeText,
        onFocus,
        placeholder,
        ref,
        render,
        style,
        supportingText,
        trailingIcon,
        type = 'filled',
        ...renderProps
    } = props;

    const [{inputState, state, coreLayout, labelTextLayout, value}, setState] =
        useImmer(initialState);

    const [underlayColor] = useUnderlayColor({type});
    const {onAnimated, inputHeight, ...animatedStyle} = useAnimated({
        filled: !!value || !!placeholder,
        labelTextWidth: labelTextLayout.width,
        showSupportingText: !!supportingText,
        showLeadingIcon: !!leadingIcon,
        type,
    });

    const id = useId();
    const textFieldRef = useRef<TextInput>(null);
    const inputRef = (ref ?? textFieldRef) as RefObject<TextInput>;
    const processState = useCallback(
        (nextState: State, options: ProcessStateOptions = {}) => {
            const {element = 'container', finished} = options;

            setState(draft => {
                if (element === 'input') {
                    draft.inputState = nextState;
                } else {
                    draft.state = nextState;
                }
            });

            onAnimated(nextState, {finished, input: element === 'input'});
        },

        [onAnimated, setState],
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

    const processCoreLayout = (event: LayoutChangeEvent) => {
        const {height, width} = event.nativeEvent.layout;

        setState(draft => {
            draft.coreLayout = {height, width};
        });
    };

    const processLabelTextLayout = (event: LayoutChangeEvent) => {
        const {height, width} = event.nativeEvent.layout;

        setState(draft => {
            draft.labelTextLayout = {height, width};
        });
    };

    const handlePress = () =>
        inputState !== 'focused' &&
        processState('pressed', {
            finished: () => {
                inputRef.current?.focus();

                // setState(draft => {
                //     draft.state !== 'enabled' && (draft.state = 'hovered');
                // });
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
            state === 'enabled' && processState('enabled', {element: 'input'});

            processState('enabled', {element: 'input'});

            onBlur?.(event);
        },
        [onBlur, processState, state],
    );

    const handleHoverIn = () => processState('hovered');
    const handleHoverOut = () => processState('enabled');
    const handleChangeText = useCallback(
        (text: string) => {
            setState(draft => {
                draft.value = text;
            });

            onChangeText?.(text);
        },
        [onChangeText, setState],
    );

    const children = useMemo(
        () =>
            renderTextInput({
                defaultValue,
                onBlur: handleBlur,
                onChangeText: handleChangeText,
                onFocus: handleFocus,
                ref: inputRef,
                style: {height: inputHeight},
                testID: `textfield__input--${id}`,
            }),
        [defaultValue, handleBlur, handleChangeText, handleFocus, id, inputHeight, inputRef],
    );

    useEffect(() => {
        processAbnormalState('disabled', !!disabled);
    }, [disabled, processAbnormalState]);

    useEffect(() => {
        !disabled && processAbnormalState('error', !!error);
    }, [disabled, error, processAbnormalState]);

    return render({
        ...renderProps,
        children,
        disabled,
        id,
        inputState,
        labelText,
        leadingIcon,
        onCoreLayout: processCoreLayout,
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
        onLabelTextLayout: processLabelTextLayout,
        onPress: handlePress,
        placeholder,
        renderStyle: {
            ...animatedStyle,
            coreHeight: coreLayout.height,
            labelTextHeight: labelTextLayout.height,
            labelTextWidth: labelTextLayout.width,
            coreWidth: coreLayout.width,
        },
        shape: type === 'filled' ? 'extraSmallTop' : 'extraSmall',
        state,
        supportingText,
        trailingIcon,
        type,
        underlayColor,
        style,
    });
};
