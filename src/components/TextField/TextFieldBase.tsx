import {FC, RefObject, useCallback, useEffect, useId, useMemo, useRef} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    TextInput,
    TextStyle,
    ViewStyle,
} from 'react-native';
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
            labelColor: AnimatedInterpolation;
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
    headerLayout: {} as Pick<LayoutRectangle, 'height' | 'width'>,
    labelTextLayout: {} as Pick<LayoutRectangle, 'height' | 'width'>,
    underlayColor: undefined,
    value: '',
};

const AnimatedTextInput = Animated.createAnimatedComponent(Input);
const renderTextInput = (options: RenderTextInputOptions) => {
    const {renderStyle, ...props} = options;

    return <AnimatedTextInput {...props} style={renderStyle} />;
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
        ...renderProps
    } = props;

    const [{headerLayout, labelTextLayout, value}, setState] = useImmer(initialState);
    const [underlayColor] = useUnderlayColor({type});
    const {onAnimated, inputHeight, inputColor, ...animatedStyle} = useAnimated({
        error,
        filled: !!value || !!placeholder,
        labelTextWidth: labelTextLayout.width,
        leadingIconShow: !!leadingIcon,
        showSupportingText: !!supportingText,
        type,
    });

    const id = useId();
    const textFieldRef = useRef<TextInput>(null);
    const inputRef = (ref ?? textFieldRef) as RefObject<TextInput>;

    const processStateChange = useCallback(
        (nextState: State) => {
            onAnimated(nextState, {
                finished: () => nextState === 'focused' && inputRef.current?.focus(),
            });
        },

        [inputRef, onAnimated],
    );

    const {state, ...handleEvent} = useHandleEvent({
        ...props,
        omitEvents: ['onPress', 'onPressIn', 'onLongPress', 'onPressOut'],
        onStateChange: processStateChange,
    });

    const processHeaderLayout = (event: LayoutChangeEvent) => {
        const {height, width} = event.nativeEvent.layout;

        setState(draft => {
            draft.headerLayout = {height, width};
        });
    };

    const processLabelTextLayout = (event: LayoutChangeEvent) => {
        const {height, width} = event.nativeEvent.layout;

        setState(draft => {
            draft.labelTextLayout = {height, width};
        });
    };

    const handleChangeText = useCallback(
        (text: string) => {
            onChangeText?.(text);
            setState(draft => {
                draft.value = text;
            });
        },
        [onChangeText, setState],
    );

    const children = useMemo(
        () =>
            renderTextInput({
                defaultValue,
                onChangeText: handleChangeText,
                ref: inputRef,
                renderStyle: {height: inputHeight, color: inputColor},
                testID: `textfield__input--${id}`,
            }),
        [defaultValue, handleChangeText, id, inputColor, inputHeight, inputRef],
    );

    useEffect(() => {
        processStateChange(disabled ? 'disabled' : state);
    }, [disabled, processStateChange, state]);

    useEffect(() => {
        !disabled && processStateChange(error ? 'error' : state);
    }, [disabled, error, processStateChange, state]);

    return render({
        ...handleEvent,
        ...renderProps,
        children,
        disabled,
        id,
        labelText,
        leadingIcon,
        onHeaderLayout: processHeaderLayout,
        onLabelTextLayout: processLabelTextLayout,
        placeholder,
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
