import {FC, RefObject, useCallback, useId, useMemo, useRef} from 'react';
import {
    Animated,
    LayoutChangeEvent,
    LayoutRectangle,
    TextInput,
    ViewStyle,
} from 'react-native';
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

export interface RenderProps
    extends Partial<Pick<ShapeProps, 'shape'> & SearchProps> {
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        innerHeight: AnimatedInterpolation;
    } & {
        height: number;
        listBackgroundColor: string;
        width: number;
    };
    listVisible?: boolean;
    state: State;
    underlayColor: string;
}
export interface SearchBaseProps extends SearchProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface Data extends ListDataSource {
    active: boolean;
}

export type RenderTextInputOptions = SearchProps;

const initialState = {
    layout: {} as LayoutRectangle,
    underlayColor: undefined,
    value: '',
};

const renderTextInput = (options: RenderTextInputOptions) => (
    <Input
        {...options}
        // @ts-ignore
        enableFocusRing={false}
        textAlignVertical="center"
    />
);

export const SearchBase: FC<SearchBaseProps> = props => {
    const {
        defaultValue,
        leadingIcon,
        onChangeText,
        placeholder,
        ref,
        render,
        ...renderProps
    } = props;

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
            const focused = ['focus', 'pressOut'].includes(nextState);

            focused && inputRef.current?.focus();
        },
        [inputRef],
    );

    const {state, onBlur, onFocus, ...handleEvent} = useHandleEvent({
        ...props,
        lockFocusState: true,
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
        const nativeEventLayout = event.nativeEvent.layout;

        setState(draft => {
            draft.layout = nativeEventLayout;
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
        placeholder,
        shape: listVisible ? 'extraLargeTop' : 'extraLarge',
        state,
        underlayColor,
        renderStyle: {
            height: layout.height,
            innerHeight,
            width: layout.width,
            listBackgroundColor: theme.color.rgba(
                theme.palette.surface.surface,
                0,
            ),
        },
        leadingIcon: leadingIcon ?? (
            <Icon type="outlined" name="search" width={24} height={24} />
        ),
    });
};
