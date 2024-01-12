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
import {useImmer} from 'use-immer';
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

const AnimatedTextInput = Animated.createAnimatedComponent(Input);
const renderTextInput = (props: RenderTextInputProps) => {
    const {renderStyle, ...inputProps} = props;

    return (
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
};

const initialState = {
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
    state: 'enabled' as State,
    value: undefined as string | undefined,
};

export const TextFieldBase: FC<TextFieldBaseProps> = props => {
    const {
        labelText = 'Label',
        onChangeText,
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
    } = props;

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
    const processFocus = useCallback(() => {
        inputRef.current?.focus();
    }, [inputRef]);

    const processState = useCallback(
        (nextState: State, options: Pick<OnStateChangeOptions, 'eventName'>) => {
            const {eventName: nextEventName} = options;

            setState(draft => {
                if (draft.state === 'focused') {
                    if (nextEventName === 'blur') {
                        draft.eventName = nextEventName;
                        draft.state = nextState;
                    }

                    return;
                }

                draft.eventName = nextEventName;
                draft.state = nextState;
            });
        },
        [setState],
    );

    const processLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const nativeEventLayout = event.nativeEvent.layout;

            setState(draft => {
                draft.layout = nativeEventLayout;
            });
        },
        [setState],
    );

    const processStateChange = useCallback(
        (nextState: State, options = {} as OnStateChangeOptions) => {
            const {event, eventName: nextEventName} = options;
            const nextEvent = {
                layout: () => {
                    processLayout(event as LayoutChangeEvent);
                },
                pressOut: () => {
                    processFocus();
                },
                focus: () => {
                    processFocus();
                },
            };

            nextEvent[nextEventName as keyof typeof nextEvent]?.();

            processState(nextState, {eventName: nextEventName});
        },
        [processFocus, processLayout, processState],
    );

    const [{onBlur, onFocus, ...onEvent}] = useOnEvent({
        ...props,
        onStateChange: processStateChange,
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

    const handleChangeText = useCallback(
        (text: string) => {
            setState(draft => {
                draft.value = text;
            });

            onChangeText?.(text);
        },
        [onChangeText, setState],
    );

    const input = useMemo(
        () =>
            renderTextInput({
                ...textInputProps,
                onBlur,
                onChangeText: handleChangeText,
                onFocus,
                placeholderTextColor,
                ref: inputRef,
                renderStyle: {color: inputColor},
                testID: `textField__input--${id}`,
                placeholder,
            }),
        [
            handleChangeText,
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
