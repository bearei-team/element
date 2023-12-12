import {FC, RefObject, useCallback, useId, useMemo, useRef} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextInput, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useImmer} from 'use-immer';
import {useHandleEvent} from '../../hooks/useHandleEvent';
import {ShapeProps} from '../Common/Common.styles';
import {AnimatedInterpolation, State} from '../Common/interface';
import {Icon} from '../Icon/Icon';
import {ListDataSource} from '../List/List';
import {SearchProps} from './Search';
import {Input} from './Search.styles';
import {useAnimated} from './useAnimated';

export interface RenderProps extends Partial<Pick<ShapeProps, 'shape'> & SearchProps> {
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        innerHeight: AnimatedInterpolation;
    } & {
        width: number;
        height: number;
        listBackgroundColor: string;
    };
    state: State;
    underlayColor: string;
    listVisible?: boolean;
}
export interface SearchBaseProps extends SearchProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface Data extends ListDataSource {
    active: boolean;
}

export type RenderTextInputOptions = SearchProps;

const initialState = {
    layout: {} as Pick<LayoutRectangle, 'height' | 'width'>,
    underlayColor: undefined,
    value: '',
};

const renderTextInput = (options: RenderTextInputOptions) => <Input {...options} />;
export const SearchBase: FC<SearchBaseProps> = props => {
    const {render, leadingIcon, onChangeText, defaultValue, placeholder, ref, ...renderProps} =
        props;

    const [{value, layout}, setState] = useImmer(initialState);
    const {innerHeight} = useAnimated({value});
    const id = useId();
    const textFieldRef = useRef<TextInput>(null);
    const inputRef = (ref ?? textFieldRef) as RefObject<TextInput>;
    const theme = useTheme();
    const placeholderTextColor = theme.palette.surface.onSurfaceVariant;
    const underlayColor = theme.palette.surface.onSurface;
    const listVisible = !!value;

    const processStateChange = useCallback(
        (nextState: State) => {
            const focused = ['focused', 'pressIn', 'longPressIn'].includes(nextState);

            focused && inputRef.current?.focus();
        },
        [inputRef],
    );

    const {state, onBlur, onFocus, ...handleEvent} = useHandleEvent({
        ...props,
        lockFocusEvent: true,
        onStateChange: processStateChange,
    });

    const handleChangeText = useCallback(
        (text: string) => {
            onChangeText?.(text);
            setState(draft => {
                draft.value = text;
            });
        },
        [onChangeText, setState],
    );

    const processLayout = (event: LayoutChangeEvent) => {
        const {height, width} = event.nativeEvent.layout;

        setState(draft => {
            draft.layout = {height, width};
        });
    };

    const children = useMemo(
        () =>
            renderTextInput({
                defaultValue,
                onBlur,
                onChangeText: handleChangeText,
                onFocus,
                placeholder,
                placeholderTextColor,
                ref: inputRef,
                testID: `search__input--${id}`,
                value,
            }),
        [
            defaultValue,
            handleChangeText,
            id,
            inputRef,
            onBlur,
            onFocus,
            placeholder,
            placeholderTextColor,
            value,
        ],
    );

    return render({
        ...renderProps,
        ...handleEvent,
        children,
        id,
        listVisible,
        onFocus,
        onLayout: processLayout,
        shape: listVisible ? 'extraLargeTop' : 'extraLarge',
        state,
        underlayColor,
        renderStyle: {
            height: layout.height,
            innerHeight,
            width: layout.width,
            listBackgroundColor: theme.color.rgba(theme.palette.surface.surface, 0),
        },
        leadingIcon: leadingIcon ?? <Icon type="outlined" name="search" width={24} height={24} />,
    });
};
