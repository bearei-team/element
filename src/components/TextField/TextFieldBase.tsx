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
import {useHandleEvent} from '../../hooks/useHandleEvent';
import {AnimatedInterpolation, State} from '../Common/interface';
import {TextFieldProps} from './TextField';
import {Input} from './TextField.styles';
import {useAnimated} from './useAnimated';
import {useUnderlayColor} from './useUnderlayColor';

export interface RenderProps extends TextFieldProps {
    onLabelTextLayout: (event: LayoutChangeEvent) => void;
    onHeaderLayout: (event: LayoutChangeEvent) => void;
    renderStyle: Animated.WithAnimatedObject<
        ViewStyle & {
            activeIndicatorColor: AnimatedInterpolation;
            activeIndicatorHeight: AnimatedInterpolation;
            inputContainerHeight: AnimatedInterpolation;
            labelColor: AnimatedInterpolation;
            labelHeight: AnimatedInterpolation;
            labelLeft?: AnimatedInterpolation;
            labelLineHeight: AnimatedInterpolation;
            labelLineLetterSpacing: AnimatedInterpolation;
            labelSize: AnimatedInterpolation;
            labelTextBackgroundWidth?: AnimatedInterpolation;
            labelTop?: AnimatedInterpolation;
            supportingTextColor: AnimatedInterpolation;
            supportingTextOpacity: AnimatedInterpolation;
        }
    > & {
        headerHeight: number;
        headerWidth: number;
        labelTextHeight: number;
        labelTextWidth: number;
    };
    state: State;
    underlayColor: string;
}

export interface TextFieldBaseProps extends TextFieldProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export type RenderTextInputOptions = TextFieldProps & {
    renderStyle: Animated.WithAnimatedObject<TextStyle>;
};

const initialState = {
    headerLayout: {} as LayoutRectangle,
    labelTextLayout: {} as LayoutRectangle,
    underlayColor: undefined,
    value: '',
};

const AnimatedTextInput = Animated.createAnimatedComponent(Input);
const renderTextInput = (options: RenderTextInputOptions) => {
    const {renderStyle, ...props} = options;

    return (
        <AnimatedTextInput
            {...props}
            style={renderStyle}
            /**
             * The current parameter function has been implemented,
             * but react-native-macos doesn't provide a special typescript type declaration yet,
             * so the current attribute ignores the type error hints for the time being.
             */
            // @ts-ignore
            enableFocusRing={false}
            textAlignVertical="center"
        />
    );
};

export const TextFieldBase: FC<TextFieldBaseProps> = props => {
    const {
        defaultValue,
        disabled = false,
        error = false,
        labelText = 'Label',
        leadingIcon,
        onChangeText,
        placeholder,
        ref,
        render,
        style,
        supportingText,
        trailingIcon,
        type = 'filled',
        ...textInputProps
    } = props;

    const [{headerLayout, labelTextLayout, value}, setState] =
        useImmer(initialState);

    const [underlayColor] = useUnderlayColor({type});
    const theme = useTheme();
    const placeholderTextColor = theme.palette.surface.onSurfaceVariant;
    const id = useId();
    const textFieldRef = useRef<TextInput>(null);
    const inputRef = (ref ?? textFieldRef) as RefObject<TextInput>;
    const {state, eventName, onBlur, onFocus, ...handleEvent} = useHandleEvent({
        ...props,
        disabled,
        lockFocusState: true,
        lockPressInState: true,
    });

    const processAnimatedFinished = useCallback(
        (focused: boolean) => {
            focused && inputRef.current?.focus();
        },
        [inputRef],
    );

    const {inputColor, ...animatedStyle} = useAnimated({
        disabled,
        error,
        eventName,
        filled: !!value || !!placeholder,
        finished: processAnimatedFinished,
        labelTextWidth: labelTextLayout.width,
        leadingIconShow: !!leadingIcon,
        state,
        supportingTextShow: !!supportingText,
        type,
    });

    const processHeaderLayout = (event: LayoutChangeEvent) => {
        const nativeEventLayout = event.nativeEvent.layout;

        setState(draft => {
            draft.headerLayout = nativeEventLayout;
        });
    };

    const processLabelTextLayout = (event: LayoutChangeEvent) => {
        const nativeEventLayout = event.nativeEvent.layout;

        setState(draft => {
            draft.labelTextLayout = nativeEventLayout;
        });
    };

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
                ...textInputProps,
                defaultValue,
                onBlur,
                onChangeText: handleChangeText,
                onFocus,
                placeholder,
                placeholderTextColor,
                ref: inputRef,
                renderStyle: {color: inputColor},
                testID: `textfield__input--${id}`,
            }),
        [
            defaultValue,
            handleChangeText,
            id,
            inputColor,
            inputRef,
            onBlur,
            onFocus,
            placeholder,
            placeholderTextColor,
            textInputProps,
        ],
    );

    return render({
        ...handleEvent,
        children,
        disabled,
        id,
        labelText,
        leadingIcon,
        onHeaderLayout: processHeaderLayout,
        onLabelTextLayout: processLabelTextLayout,
        renderStyle: {
            ...animatedStyle,
            headerHeight: headerLayout.height,
            headerWidth: headerLayout.width,
            labelTextHeight: labelTextLayout.height,
            labelTextWidth: labelTextLayout.width,
        },
        shape: type === 'filled' ? 'extraSmallTop' : 'extraSmall',
        state,
        style,
        supportingText,
        trailingIcon,
        type,
        underlayColor,
    });
};
