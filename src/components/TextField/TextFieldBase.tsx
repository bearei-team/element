import {FC, RefAttributes, RefObject, useCallback, useEffect, useId, useMemo, useRef} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    NativeSyntheticEvent,
    PressableProps,
    TextInput,
    TextInputContentSizeChangeEventData,
    TextInputProps,
    TextStyle,
    ViewStyle,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {ShapeProps} from '../Common/Common.styles';
import {AnimatedInterpolation, EventName, State} from '../Common/interface';
import {Input} from './TextField.styles';
import {useAnimated} from './useAnimated';

type TextFieldType = 'filled' | 'outlined';
type InputProps = Partial<
    TextInputProps & PressableProps & RefAttributes<TextInput> & Pick<ShapeProps, 'shape'>
>;

export interface TextFieldProps extends InputProps {
    disabled?: boolean;
    error?: boolean;
    labelText?: string;
    leading?: React.JSX.Element;
    supportingText?: string;
    trailing?: React.JSX.Element;
    type?: TextFieldType;
}

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

interface TextFieldBaseProps extends TextFieldProps {
    render: (props: RenderProps) => React.JSX.Element;
}

type RenderTextInputProps = TextFieldProps & {
    renderStyle: Animated.WithAnimatedObject<TextStyle>;
};

interface InitialState {
    contentSize?: TextInputContentSizeChangeEventData['contentSize'];
    eventName: EventName;
    layout: LayoutRectangle;
    state: State;
    value?: string;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessContentSizeChangeOptions = Pick<RenderProps, 'onContentSizeChange'> &
    ProcessEventOptions;

type ProcessChangeTextOptions = Pick<RenderProps, 'onChangeText'> & ProcessEventOptions;
type ProcessStateChangeOptions = {ref?: RefObject<TextInput>} & ProcessEventOptions &
    OnStateChangeOptions;

const processFocus = (ref?: RefObject<TextInput>) => ref?.current?.focus();
const processLayout = (event: LayoutChangeEvent, {setState}: ProcessEventOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    setState(draft => {
        const update =
            draft.layout.width !== nativeEventLayout.width ||
            draft.layout.height !== nativeEventLayout.height;

        update && (draft.layout = nativeEventLayout);
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
    } as Record<EventName, () => void>;

    nextEvent[eventName]?.();

    setState(draft => {
        if (draft.state === 'focused' && eventName !== 'blur') {
            return;
        }

        draft.eventName = eventName;
        draft.state = state;
    });
};

const processContentSizeChange = (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
    {setState, onContentSizeChange}: ProcessContentSizeChangeOptions,
) => {
    const contentSize = event.nativeEvent.contentSize;

    setState(draft => {
        if (draft.contentSize?.height === contentSize.height) {
            return;
        }

        draft.contentSize = contentSize;

        onContentSizeChange?.(event);
    });
};

const processChangeText = ({setState, onChangeText}: ProcessChangeTextOptions, text?: string) =>
    typeof text === 'string' &&
    setState(draft => {
        if (draft.value === text) {
            return;
        }

        draft.value = text;

        onChangeText?.(text);
    });

const AnimatedTextInput = Animated.createAnimatedComponent(Input);
const renderTextInput = ({
    id,
    renderStyle,
    multiline,
    secureTextEntry,
    ...inputProps
}: RenderTextInputProps) => (
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
        secureTextEntry={secureTextEntry}
    />
);

export const TextFieldBase: FC<TextFieldBaseProps> = ({
    defaultValue,
    disabled,
    error,
    labelText = 'Label',
    leading,
    multiline,
    onChangeText: onChangeTextSource,
    onContentSizeChange: onContentSizeChangeSource,
    placeholder,
    ref,
    render,
    supportingText,
    trailing,
    type = 'filled',
    value: valueSource,
    ...textInputProps
}) => {
    const [{layout, eventName, state, contentSize, value}, setState] = useImmer<InitialState>({
        contentSize: undefined,
        eventName: 'none',
        layout: {} as LayoutRectangle,
        state: 'enabled',
        value: '',
    });

    const id = useId();
    const textFieldRef = useRef<TextInput>(null);
    const inputRef = (ref ?? textFieldRef) as RefObject<TextInput>;
    const theme = useTheme();
    const placeholderTextColor =
        state === 'disabled'
            ? theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 0.38)
            : theme.palette.surface.onSurfaceVariant;

    const underlayColor = theme.palette.surface.onSurface;
    const onContentSizeChange = useCallback(
        (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) =>
            processContentSizeChange(event, {
                onContentSizeChange: onContentSizeChangeSource,
                setState,
            }),
        [onContentSizeChangeSource, setState],
    );

    const onChangeText = useCallback(
        (text?: string) => processChangeText({onChangeText: onChangeTextSource, setState}, text),
        [onChangeTextSource, setState],
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
        filled: [valueSource, defaultValue, placeholder, value].some(item => item),
        state,
        type,
    });

    const input = useMemo(
        () =>
            renderTextInput({
                ...textInputProps,
                disabled,
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
            disabled,
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

    useEffect(() => {
        onChangeText(valueSource ?? defaultValue);
    }, [valueSource, defaultValue, onChangeText]);

    return render({
        contentSize,
        eventName,
        id,
        input,
        labelText,
        leading,
        multiline,
        onEvent: {...onEvent, onBlur, onFocus},
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
        state,
        supportingText,
        trailing,
        underlayColor,
    });
};
