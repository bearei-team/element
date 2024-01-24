import {FC, RefObject, useId, useMemo, useRef} from 'react';
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
import {Input} from './TextField.styles';
import {useAnimated} from './useAnimated';
import {useIcon} from './useIcon';

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
    setState?: Updater<typeof initialState>;
}

export type ProcessStateOptions = Partial<
    Pick<OnStateChangeOptions, 'eventName'> & ProcessEventOptions
>;

export type ProcessChangeTextOptions = Partial<
    Pick<RenderProps, 'onChangeText'> & ProcessEventOptions
>;

const processFocus = (ref?: RefObject<TextInput>) => ref?.current?.focus();
const processState = (state: State, {eventName = 'none', setState}: ProcessStateOptions) =>
    setState?.(draft => {
        if (draft.state === 'focused') {
            if (eventName === 'blur') {
                draft.eventName = eventName;
                draft.state = state;
            }

            return;
        }

        draft.eventName = eventName;
        draft.state = state;
    });

const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState?.(draft => {
        draft.layout = nativeEventLayout;
    });
};

const processStateChange =
    ({setState}: ProcessEventOptions) =>
    (state: State, {event, eventName} = {} as OnStateChangeOptions) => {
        const nextEvent = {
            focus: () => processFocus(),
            layout: () => processLayout(event as LayoutChangeEvent, {setState}),
            pressOut: () => processFocus(),
        };

        nextEvent[eventName as keyof typeof nextEvent]?.();

        processState(state, {eventName});
    };

const processChangeText =
    ({setState, onChangeText}: ProcessChangeTextOptions) =>
    (text: string) => {
        setState?.(draft => {
            draft.value = text;
        });

        onChangeText?.(text);
    };

const AnimatedTextInput = Animated.createAnimatedComponent(Input);
const renderTextInput = ({renderStyle, ...inputProps}: RenderTextInputProps) => (
    <AnimatedTextInput
        {...inputProps}
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
);

const initialState = {
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
    state: 'enabled' as State,
    value: undefined as string | undefined,
};

export const TextFieldBase: FC<TextFieldBaseProps> = ({
    labelText = 'Label',
    ref,
    render,
    supportingText,
    type = 'filled',
    error,
    disabled,
    leadingIcon,
    trailingIcon,
    placeholder,
    ...textInputProps
}) => {
    const [{layout, value, eventName, state}, setState] = useImmer(initialState);
    const id = useId();
    const textFieldRef = useRef<TextInput>(null);
    const inputRef = (ref ?? textFieldRef) as RefObject<TextInput>;
    const theme = useTheme();
    const filled = value ?? placeholder;
    const placeholderTextColor =
        state === 'disabled'
            ? theme.color.rgba(theme.palette.surface.onSurface, 0.38)
            : theme.palette.surface.onSurfaceVariant;

    const underlayColor = theme.palette.surface.onSurface;
    const onChangeText = useMemo(
        () => processChangeText({setState, onChangeText: textInputProps.onChangeText}),
        [setState, textInputProps.onChangeText],
    );

    const onStateChange = useMemo(() => processStateChange({setState}), [setState]);
    const [{onBlur, onFocus, ...onEvent}] = useOnEvent({
        ...textInputProps,
        onStateChange,
    });

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

    const [{leadingIcon: leadingIconElement, trailingIcon: trailingIconElement}] = useIcon({
        error,
        disabled,
        leadingIcon,
        trailingIcon,
    });

    const input = useMemo(
        () =>
            renderTextInput({
                ...textInputProps,
                onBlur,
                onChangeText,
                onFocus,
                placeholder,
                placeholderTextColor,
                ref: inputRef,
                renderStyle: {color: inputColor},
                testID: `textField__input--${id}`,
            }),
        [
            onChangeText,
            id,
            inputColor,
            inputRef,
            onBlur,
            onFocus,
            placeholderTextColor,
            textInputProps,
            placeholder,
        ],
    );

    return render({
        eventName,
        id,
        input,
        labelText,
        leadingIcon: leadingIconElement,
        onEvent: {...onEvent, onBlur, onFocus},
        state,
        trailingIcon: trailingIconElement,
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
