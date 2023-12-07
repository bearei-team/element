import {FC, RefObject, useCallback, useEffect, useId, useMemo, useRef} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextInput, ViewStyle} from 'react-native';
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
            labelTop?: AnimatedInterpolation;
            labelTextBackgroundWidth?: AnimatedInterpolation;
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

export type RenderTextInputOptions = TextFieldProps;

const initialState = {
    labelTextLayout: {} as Pick<LayoutRectangle, 'height' | 'width'>,
    headerLayout: {} as Pick<LayoutRectangle, 'height' | 'width'>,
    underlayColor: '',
    value: '',
};

const AnimatedTextInput = Animated.createAnimatedComponent(Input);
const renderTextInput = (options: RenderTextInputOptions) => <AnimatedTextInput {...options} />;
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
        filled: !!value || !!placeholder,
        labelTextWidth: labelTextLayout.width,
        showSupportingText: !!supportingText,
        showLeadingIcon: !!leadingIcon,
        type,
        error,
    });

    const id = useId();
    const textFieldRef = useRef<TextInput>(null);
    const inputRef = (ref ?? textFieldRef) as RefObject<TextInput>;

    const processState = useCallback(
        (nextState: State) => {
            onAnimated(nextState, {
                finished: () => nextState === 'focused' && inputRef.current?.focus(),
            });
        },

        [inputRef, onAnimated],
    );

    const {
        state,
        onPress: _onPress,
        onPressIn,
        onLongPress,
        ...handleEvent
    } = useHandleEvent({
        ...props,
        onProcessState: processState,
    });

    const processAbnormalState = useCallback(
        (nextState: State) => {
            processState(nextState);
        },
        [processState],
    );

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
                onChangeText: handleChangeText,
                ref: inputRef,
                style: {height: inputHeight, color: inputColor},
                testID: `textfield__input--${id}`,
            }),
        [defaultValue, handleChangeText, id, inputHeight, inputRef],
    );

    useEffect(() => {
        processAbnormalState(disabled ? 'disabled' : state);
    }, [disabled, processAbnormalState, state]);

    useEffect(() => {
        !disabled && processState(error ? 'error' : state);
    }, [disabled, error, processState, state]);

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
            labelTextHeight: labelTextLayout.height,
            labelTextWidth: labelTextLayout.width,
            headerWidth: headerLayout.width,
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
