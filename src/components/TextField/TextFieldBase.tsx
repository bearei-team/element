import {FC, RefObject, useCallback, useId, useMemo, useRef} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    NativeSyntheticEvent,
    TextInput,
    TextInputContentSizeChangeEventData,
    TextStyle,
    ViewStyle,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {AnimatedInterpolation, EventName, State} from '../Common/interface';
import {TextFieldProps} from './TextField';
import {Input} from './TextField.styles';
import {useAnimated} from './useAnimated';

export interface RenderProps extends TextFieldProps {
    contentSize?: Partial<TextInputContentSizeChangeEventData['contentSize']>;
    eventName: EventName;
    input: React.JSX.Element;
    onEvent: OnEvent;
    state: State;
    underlayColor: string;
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        activeIndicatorBackgroundColor: AnimatedInterpolation;
        activeIndicatorHeight: AnimatedInterpolation;
        height: number;
        labelTextColor: AnimatedInterpolation;
        labelTextHeight: AnimatedInterpolation;
        labelTextLetterSpacing: AnimatedInterpolation;
        labelTextLineHeight: AnimatedInterpolation;
        labelTextSize: AnimatedInterpolation;
        labelTextTop: AnimatedInterpolation;
        supportingTextColor: AnimatedInterpolation;
        width: number;
    };
}

export interface TextFieldBaseProps extends TextFieldProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export type RenderTextInputProps = TextFieldProps & {
    renderStyle: Animated.WithAnimatedObject<TextStyle>;
};

export interface InitialState {
    contentSize?: TextInputContentSizeChangeEventData['contentSize'];
    eventName: EventName;
    layout: LayoutRectangle;
    state: State;
    value?: string;
}

export interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

export type ProcessChangeTextOptions = Pick<RenderProps, 'onChangeText'> & ProcessEventOptions;
export type ProcessContentSizeChangeOptions = Pick<RenderProps, 'onContentSizeChange'> &
    ProcessEventOptions;

export type ProcessStateChangeOptions = {ref?: RefObject<TextInput>} & ProcessEventOptions &
    OnStateChangeOptions;

export type ProcessStateOptions = Pick<OnStateChangeOptions, 'eventName'> & ProcessEventOptions;

const processFocus = (ref?: RefObject<TextInput>) => ref?.current?.focus();
const processState = (state: State, {eventName, setState}: ProcessStateOptions) =>
    setState(draft => {
        if (draft.state === 'focused' && eventName !== 'blur') {
            return;
        }

        draft.eventName = eventName;
        draft.state = state;
    });

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processStateChange = (
    state: State,
    {event, eventName, setState, ref}: ProcessStateChangeOptions,
) => {
    const nextEvent = {
        focus: () => processFocus(ref),
        layout: () => processLayout(event as LayoutChangeEvent, {setState}),
        pressOut: () => processFocus(ref),
    };

    nextEvent[eventName as keyof typeof nextEvent]?.();

    processState(state, {eventName, setState});
};

const processChangeText = (text: string, {onChangeText}: ProcessChangeTextOptions) =>
    onChangeText?.(text);

const processContentSizeChange = (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
    {setState, onContentSizeChange}: ProcessContentSizeChangeOptions,
) => {
    const contentSize = event.nativeEvent.contentSize;

    setState(draft => {
        draft.contentSize = contentSize;
    });

    onContentSizeChange?.(event);
};

const AnimatedTextInput = Animated.createAnimatedComponent(Input);
const renderTextInput = ({id, renderStyle, multiline, ...inputProps}: RenderTextInputProps) => (
    <AnimatedTextInput
        {...inputProps}
        style={renderStyle}
        testID={`textField__input--${id}`}
        multiline={multiline}
        multilineText={multiline}
        /**
         * enableFocusRing is used to disable the focus style in macOS,
         * this parameter has been implemented and is available.
         * However, react-native-macos does not have an official typescript declaration for this parameter,
         * so using it directly in a typescript will result in an undefined parameter.
         */
        // @ts-ignore
        enableFocusRing={false}
        textAlignVertical="top"
    />
);

export const TextFieldBase: FC<TextFieldBaseProps> = ({
    defaultValue,
    disabled,
    error,
    labelText = 'Label',
    leading,
    multiline,
    placeholder,
    ref,
    render,
    supportingText,
    trailing,
    type = 'filled',
    value,
    ...textInputProps
}) => {
    const [{layout, eventName, state, contentSize}, setState] = useImmer<InitialState>({
        contentSize: undefined,
        eventName: 'none',
        layout: {} as LayoutRectangle,
        state: 'enabled',
    });

    const id = useId();
    const textFieldRef = useRef<TextInput>(null);
    const inputRef = (ref ?? textFieldRef) as RefObject<TextInput>;
    const theme = useTheme();
    const filled = defaultValue ?? value ?? placeholder;
    const placeholderTextColor =
        state === 'disabled'
            ? theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 0.38)
            : theme.palette.surface.onSurfaceVariant;

    const underlayColor = theme.palette.surface.onSurface;
    const onContentSizeChange = useCallback(
        (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) =>
            processContentSizeChange(event, {
                onContentSizeChange: textInputProps.onContentSizeChange,
                setState,
            }),
        [setState, textInputProps.onContentSizeChange],
    );

    const onChangeText = useCallback(
        (text: string) =>
            processChangeText(text, {setState, onChangeText: textInputProps.onChangeText}),
        [setState, textInputProps.onChangeText],
    );

    const onStateChange = useCallback(
        (nextState: State, options = {} as OnStateChangeOptions) =>
            processStateChange(nextState, {...options, setState, ref: inputRef}),
        [inputRef, setState],
    );

    const [{onBlur, onFocus, ...onEvent}] = useOnEvent({...textInputProps, onStateChange});
    const [
        {
            activeIndicatorBackgroundColor,
            activeIndicatorHeight,
            backgroundColor,
            inputColor,
            labelTextColor,
            labelTextHeight,
            labelTextLetterSpacing,
            labelTextLineHeight,
            labelTextSize,
            labelTextTop,
            supportingTextColor,
        },
    ] = useAnimated({
        disabled,
        error,
        eventName,
        filled: !!filled,
        state,
        type,
    });

    const input = useMemo(
        () =>
            renderTextInput({
                ...textInputProps,
                defaultValue,
                id,
                multiline,
                onBlur,
                onChangeText,
                onContentSizeChange,
                onFocus,
                placeholder,
                placeholderTextColor,
                ref: inputRef,
                renderStyle: {color: inputColor},
                value,
            }),
        [
            defaultValue,
            id,
            inputColor,
            inputRef,
            multiline,
            onBlur,
            onChangeText,
            onContentSizeChange,
            onFocus,
            placeholder,
            placeholderTextColor,
            textInputProps,
            value,
        ],
    );

    return render({
        contentSize,
        eventName,
        id,
        input,
        labelText,
        leading,
        multiline,
        onEvent: {...onEvent, onBlur, onFocus},
        state,
        trailing,
        underlayColor,
        renderStyle: {
            activeIndicatorBackgroundColor,
            activeIndicatorHeight,
            backgroundColor,
            height: layout.height,
            labelTextColor,
            labelTextHeight,
            labelTextLetterSpacing,
            labelTextLineHeight,
            labelTextSize,
            labelTextTop,
            supportingTextColor,
            width: layout.width,
        },
        supportingText,
    });
};
