import {FC, RefObject, useCallback, useId, useMemo, useRef} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    TextInput,
    TextStyle,
    ViewStyle,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {AnimatedInterpolation, EventName, State} from '../Common/interface';
import {TextFieldProps} from './TextField';
import {Input, TextField} from './TextField.styles';
import {useAnimated} from './useAnimated';

export interface RenderProps extends TextFieldProps {
    eventName: EventName;
    onEvent: OnEvent;
    underlayColor: string;
    input: React.JSX.Element;
    state: State;
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        activeIndicatorBackgroundColor: AnimatedInterpolation;
        activeIndicatorScale: AnimatedInterpolation;
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

export interface ProcessEventOptions {
    setState: Updater<typeof initialState>;
}

export type ProcessChangeTextOptions = Pick<RenderProps, 'onChangeText'> & ProcessEventOptions;
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

const processChangeText = (text: string, {setState, onChangeText}: ProcessChangeTextOptions) => {
    setState(draft => {
        draft.value = text;
    });

    onChangeText?.(text);
};

const AnimatedTextInput = Animated.createAnimatedComponent(Input);
const renderTextInput = ({renderStyle, id, ...inputProps}: RenderTextInputProps) => (
    <TextField testID={`textField__control--${id}`}>
        <AnimatedTextInput
            {...inputProps}
            testID={`textField__input--${id}`}
            style={renderStyle}
            /**
             * enableFocusRing is used to disable the focus style in macOS,
             * this parameter has been implemented and is available.
             * However, react-native-macos does not have an official typescript declaration for this parameter,
             * so using it directly in a typescript will result in an undefined parameter.
             */
            // @ts-ignore
            enableFocusRing={false}
            textAlignVertical="center"
        />
    </TextField>
);

const initialState = {
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
    state: 'enabled' as State,
    value: undefined as string | undefined,
};

export const TextFieldBase: FC<TextFieldBaseProps> = ({
    defaultValue,
    disabled,
    error,
    labelText = 'Label',
    leading,
    placeholder,
    ref,
    render,
    supportingText,
    trailing,
    type = 'filled',
    value: valueSource,
    ...textInputProps
}) => {
    const [{layout, value, eventName, state}, setState] = useImmer(initialState);
    const id = useId();
    const textFieldRef = useRef<TextInput>(null);
    const inputRef = (ref ?? textFieldRef) as RefObject<TextInput>;
    const theme = useTheme();
    const filled = defaultValue ?? valueSource ?? value ?? placeholder;
    const placeholderTextColor =
        state === 'disabled'
            ? theme.color.rgba(theme.palette.surface.onSurface, 0.38)
            : theme.palette.surface.onSurfaceVariant;

    const underlayColor = theme.palette.surface.onSurface;
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
            activeIndicatorScale,
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
        type,
        eventName,
        disabled,
        error,
        state,
        filled: !!filled,
    });

    const input = useMemo(
        () =>
            renderTextInput({
                ...textInputProps,
                defaultValue,
                id,
                onBlur,
                onChangeText,
                onFocus,
                placeholder,
                placeholderTextColor,
                ref: inputRef,
                renderStyle: {color: inputColor},
                value: valueSource,
            }),
        [
            textInputProps,
            defaultValue,
            id,
            onBlur,
            onChangeText,
            onFocus,
            placeholder,
            placeholderTextColor,
            inputRef,
            inputColor,
            valueSource,
        ],
    );

    return render({
        eventName,
        id,
        input,
        labelText,
        leading,
        onEvent: {...onEvent, onBlur, onFocus},
        state,
        trailing,
        underlayColor,
        renderStyle: {
            activeIndicatorBackgroundColor,
            activeIndicatorScale,
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
