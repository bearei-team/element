import {FC, RefObject, useCallback, useId, useMemo, useRef} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextInput, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useImmer} from 'use-immer';
import {useHandleEvent} from '../../hooks/useHandleEvent';
import {AnimatedInterpolation, State} from '../Common/interface';
import {Icon} from '../Icon/Icon';
import {SearchProps, SourceMenu} from './Search';
import {Input} from './Search.styles';
import {useAnimated} from './useAnimated';

export interface RenderProps extends SearchProps {
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        innerHeight: AnimatedInterpolation;
    } & {
        width: number;
        height: number;
    };
    state: State;
    underlayColor: string;
}
export interface SearchBaseProps extends SearchProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface RenderRipplesOptions extends Pick<SearchProps, 'menus'> {
    onActive: (key: string) => void;
}

export interface Menu extends SourceMenu {
    active: boolean;
}

const initialState = {
    layout: {} as Pick<LayoutRectangle, 'height' | 'width'>,
    underlayColor: undefined,
    value: '',
};

const renderTextInput = (options: any) => {
    const {renderStyle, ...props} = options;

    return <Input {...props} style={renderStyle} />;
};

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

    const processStateChange = useCallback(
        (nextState: State) => {
            nextState === 'focused' && inputRef.current?.focus();
        },
        [inputRef],
    );

    const {state, ...handleEvent} = useHandleEvent({
        ...props,
        omitEvents: ['onPress', 'onPressIn', 'onLongPress', 'onPressOut'],
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
                onChangeText: handleChangeText,
                placeholder,
                placeholderTextColor,
                ref: inputRef,
                testID: `search__input--${id}`,
                value,
            }),
        [defaultValue, handleChangeText, id, inputRef, placeholder, placeholderTextColor, value],
    );

    return render({
        ...handleEvent,
        ...renderProps,
        children,
        id,
        state,
        underlayColor,
        onLayout: processLayout,
        renderStyle: {
            width: layout.width,
            height: layout.height,
            innerHeight,
        },
        leadingIcon: leadingIcon ?? <Icon type="outlined" name="search" width={24} height={24} />,
    });
};
