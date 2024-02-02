import {FC, RefObject, useCallback, useEffect, useId, useMemo, useRef} from 'react';
import {Animated, LayoutRectangle, TextInput, View} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater, useImmer} from 'use-immer';
import {emitter} from '../../context/ModalProvider';
import {HOOK} from '../../hooks/hook';
import {OnEvent, OnStateChangeOptions} from '../../hooks/useOnEvent';
import {ComponentStatus, EventName, State} from '../Common/interface';
import {Divider} from '../Divider/Divider';
import {Hovered} from '../Hovered/Hovered';
import {Icon} from '../Icon/Icon';
import {List, ListDataSource} from '../List/List';
import {SearchProps} from './Search';
import {Content, Header, Inner, Input, LeadingIcon, TextField, TrailingIcon} from './Search.styles';
import {useAnimated} from './useAnimated';

export interface RenderProps extends SearchProps {
    containerRef: RefObject<View>;
    onEvent: Pick<OnEvent, 'onLayout'>;
}

export interface SearchBaseProps extends SearchProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface Data extends ListDataSource {
    active: boolean;
}

export type RenderTextInputOptions = SearchProps;

export interface ProcessEventOptions {
    setState: Updater<typeof initialState>;
}

export type ProcessChangeTextOptions = Pick<RenderProps, 'data' | 'onChangeText'> &
    ProcessEventOptions;

export type ProcessListActiveOptions = Pick<RenderProps, 'data' | 'onActive'> & ProcessEventOptions;
export type ProcessStateChangeOptions = {ref?: RefObject<TextInput>} & ProcessEventOptions &
    OnStateChangeOptions;

export type ProcessStateOptions = ProcessEventOptions & Pick<OnStateChangeOptions, 'eventName'>;
export type ProcessListVisibleOptions = ProcessEventOptions & {state: State};
export interface ProcessEmitOptions extends Pick<RenderProps, 'visible'> {
    inner: React.JSX.Element;
    id: string;
}

const processListActive = ({data, setState, onActive}: ProcessListActiveOptions, key?: string) => {
    if (!key) {
        return;
    }

    const nextValue = data?.find(datum => datum.key === key)?.headline;

    if (!nextValue) {
        return;
    }

    setState(draft => {
        draft.activeKey = key;
        draft.value = nextValue;
    });

    onActive?.(key);
};

const processFocus = (ref?: RefObject<TextInput>) => ref?.current?.focus();
const processState = (state: State, {eventName, setState}: ProcessStateOptions) => {
    setState(draft => {
        if (draft.state === 'focused') {
            if (eventName !== 'blur') {
                return;
            }

            draft.eventName = eventName;
            draft.state = state;

            return;
        }

        draft.eventName = eventName;
        draft.state = state;
    });
};

const processLayout = ({setState}: ProcessEventOptions) =>
    setState(draft => {
        draft.status = 'succeeded';
    });

const processStateChange = (
    state: State,
    {eventName, ref, setState}: ProcessStateChangeOptions,
) => {
    const nextEvent = {
        focus: () => processFocus(ref),
        layout: () => processLayout({setState}),
        pressOut: () => processFocus(ref),
    };

    nextEvent[eventName as keyof typeof nextEvent]?.();

    processState(state, {eventName, setState});
};

const processChangeText = (
    text: string,
    {setState, data = [], onChangeText}: ProcessChangeTextOptions,
) => {
    const matchData = text
        ? data.filter(({headline, supportingText}) => {
              const matchText = text.toLowerCase();
              const headlineMatch = !!headline?.toLowerCase().includes(matchText);
              const supportingTextMatch = !!supportingText?.toLowerCase().includes(matchText);

              return headlineMatch || supportingTextMatch;
          })
        : [];

    setState(draft => {
        draft.activeKey = '';
        draft.data = matchData;
        draft.value = text;
    });

    onChangeText?.(text);
};

const processListVisible = (
    {setState, state}: ProcessListVisibleOptions,
    data?: ListDataSource[],
) =>
    setState(draft => {
        draft.listVisible =
            typeof data?.length === 'number' && data?.length !== 0 && state === 'focused';
    });

const processContainerLayout = (containerRef: RefObject<View>, {setState}: ProcessEventOptions) =>
    containerRef.current?.measure((x, y, width, height, pageX, pageY) => {
        setState(draft => {
            draft.layout = {x, y, width, height, pageX, pageY};
        });
    });

const processEmit = (status: ComponentStatus, {visible, inner, id}: ProcessEmitOptions) =>
    status === 'succeeded' &&
    emitter.emit('sheet', {id: `search__${id}`, element: visible ? inner : <></>});

const renderTextInput = ({id, ...inputProps}: RenderTextInputOptions) => (
    <TextField testID={`search__control--${id}`}>
        <Input
            {...inputProps}
            testID={`search__input--${id}`}
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
    activeKey: undefined as string | undefined,
    data: [] as ListDataSource[],
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle & {pageX: number; pageY: number},
    listVisible: false,
    state: 'enabled' as State,
    status: 'idle' as ComponentStatus,
    value: undefined as string | undefined,
};

const AnimatedInner = Animated.createAnimatedComponent(Inner);
export const SearchBase: FC<SearchBaseProps> = ({
    data: dataSources,
    leadingIcon,
    onActive,
    placeholder,
    ref,
    render,
    trailingIcon,
    visible,
    ...textInputProps
}) => {
    const [{activeKey, data, eventName, layout, listVisible, state, status, value}, setState] =
        useImmer(initialState);

    const [{innerHeight}] = useAnimated({listVisible});
    const containerRef = useRef<View>(null);
    const id = useId();
    const textFieldRef = useRef<TextInput>(null);
    const inputRef = (ref ?? textFieldRef) as RefObject<TextInput>;
    const theme = useTheme();
    const placeholderTextColor = theme.palette.surface.onSurfaceVariant;
    const underlayColor = theme.palette.surface.onSurface;
    const onStateChange = useCallback(
        (nextState: State, options = {} as OnStateChangeOptions) =>
            processStateChange(nextState, {...options, ref: textFieldRef, setState}),
        [setState],
    );

    const [{onBlur, onFocus, onLayout, ...onEvent}] = HOOK.useOnEvent({
        ...textInputProps,
        onStateChange,
    });

    const onListActive = useCallback(
        (key?: string) => processListActive({data, setState, onActive}, key),
        [data, onActive, setState],
    );

    const onChangeText = useCallback(
        (text: string) => processChangeText(text, {data: dataSources, setState}),
        [dataSources, setState],
    );

    const input = useMemo(
        () =>
            renderTextInput({
                ...textInputProps,
                id,
                onBlur,
                onChangeText,
                onFocus,
                placeholder,
                placeholderTextColor,
                ref: inputRef,
                value,
            }),
        [
            id,
            inputRef,
            onBlur,
            onChangeText,
            onFocus,
            placeholder,
            placeholderTextColor,
            textInputProps,
            value,
        ],
    );

    const inner = useMemo(() => {
        const shape = 'extraLarge';
        const {height, pageX, pageY, width} = layout;

        return (
            <AnimatedInner
                key={`search__inner--${id}`}
                pageX={pageX}
                pageY={pageY}
                shape={shape}
                style={{height: innerHeight}}
                testID={`search__inner--${id}`}
                width={width}>
                <Header
                    {...onEvent}
                    accessibilityLabel={placeholder}
                    accessibilityRole="keyboardkey"
                    onBlur={onBlur}
                    onFocus={onFocus}
                    testID={`search__header--${id}`}>
                    <LeadingIcon testID={`search__leadingIcon--${id}`}>
                        {leadingIcon ?? (
                            <Icon type="outlined" name="search" width={24} height={24} />
                        )}
                    </LeadingIcon>

                    <Content testID={`search__content--${id}`}>{input}</Content>
                    <TrailingIcon testID={`search__trailingIcon--${id}`}>
                        {trailingIcon}
                    </TrailingIcon>

                    <Hovered
                        eventName={eventName}
                        height={height}
                        opacities={[0, 0.08]}
                        shape={listVisible ? 'extraLargeTop' : shape}
                        underlayColor={underlayColor}
                        width={width}
                    />
                </Header>

                <Divider size="large" width={width} />
                <List
                    activeKey={activeKey}
                    data={data}
                    onActive={onListActive}
                    style={{backgroundColor: theme.color.rgba(theme.palette.surface.surface, 0)}}
                />
            </AnimatedInner>
        );
    }, [
        layout,
        id,
        innerHeight,
        onEvent,
        placeholder,
        onBlur,
        onFocus,
        leadingIcon,
        input,
        trailingIcon,
        eventName,
        listVisible,
        underlayColor,
        activeKey,
        data,
        onListActive,
        theme.color,
        theme.palette.surface.surface,
    ]);

    useEffect(() => {
        processListVisible({setState, state}, data);
    }, [data, setState, state]);

    useEffect(() => {
        processContainerLayout(containerRef, {setState});
    }, [setState]);

    useEffect(() => {
        processEmit(status, {id, inner, visible});
    }, [id, inner, status, visible]);

    return render({
        containerRef,
        data,
        id,
        placeholder,
        onEvent: {onLayout},
    });
};
