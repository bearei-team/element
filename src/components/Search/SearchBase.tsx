import {
    RefAttributes,
    RefObject,
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react';
import {
    Animated,
    LayoutRectangle,
    PressableProps,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater, useImmer} from 'use-immer';
import {emitter} from '../../context/ModalProvider';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {ComponentStatus, EventName, State} from '../Common/interface';
import {List, ListDataSource, ListProps} from '../List/List';
import {Input, SearchList, TextField} from './Search.styles';
import {useAnimated} from './useAnimated';

type BaseProps = Partial<
    TextInputProps &
        Pick<ListProps, 'activeKey' | 'onActive' | 'data' | 'defaultActiveKey'> &
        PressableProps &
        RefAttributes<TextInput>
>;

export interface SearchProps extends BaseProps {
    disabled?: boolean;
    leading?: React.JSX.Element;
    trailing?: React.JSX.Element;
}

export interface RenderProps extends SearchProps {
    containerRef: RefObject<View>;
    eventName: EventName;
    iconRenderStyle: {width: number; height: number};
    input: React.JSX.Element;
    layout: LayoutRectangle;
    listVisible?: boolean;
    onEvent: Omit<OnEvent, 'onBlur' | 'onFocus'>;
    underlayColor: string;
}

interface SearchBaseProps extends SearchProps {
    render: (props: RenderProps) => React.JSX.Element;
}

interface InitialState {
    data: ListDataSource[];
    eventName: EventName;
    layout: LayoutRectangle & {pageX: number; pageY: number};
    listVisible?: boolean;
    state: State;
    status: ComponentStatus;
    value?: string;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessChangeTextOptions = Pick<RenderProps, 'data' | 'onChangeText'> & ProcessEventOptions;
type ProcessEmitOptions = Pick<InitialState, 'status' | 'listVisible'> & Pick<RenderProps, 'id'>;
type ProcessListVisibleOptions = ProcessEventOptions & Pick<InitialState, 'state'>;
type ProcessStateChangeOptions = {ref?: RefObject<TextInput>} & ProcessEventOptions &
    OnStateChangeOptions;

type RenderTextInputOptions = SearchProps;
type RenderSearchListOptions = SearchProps & {
    containerHeight?: number;
    containerPageX?: number;
    containerPageY?: number;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {width?: number};
    visible?: boolean;
};

const processFocus = (ref?: RefObject<TextInput>) => ref?.current?.focus();
const processStateChange = (
    state: State,
    {eventName, ref, setState}: ProcessStateChangeOptions,
) => {
    const nextEvent = {
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

const processChangeText = (
    {setState, data = [], onChangeText}: ProcessChangeTextOptions,
    text?: string,
) => {
    const matchedData = text
        ? data.filter(({headline, supportingText}) => {
              const matchText = text.toLowerCase();
              const headlineMatch = !!headline?.toLowerCase().includes(matchText);
              const supportingTextMatch = !!supportingText?.toLowerCase().includes(matchText);

              return headlineMatch || supportingTextMatch;
          })
        : [];

    setState(draft => {
        if (draft.value === text) {
            return;
        }

        const processSort = (a: ListDataSource, b: ListDataSource) =>
            (a.headline?.length ?? 0) - (b.headline?.length ?? 0);

        const sortedDraftData = [...draft.data].sort(processSort);
        const sortedMatchedData = [...matchedData].sort(processSort);

        JSON.stringify(sortedMatchedData) !== JSON.stringify(sortedDraftData) &&
            (draft.data = matchedData);

        draft.value = typeof text === 'undefined' ? '' : text;
    });

    typeof text === 'string' && onChangeText?.(text);
};

const processListVisible = ({setState}: ProcessListVisibleOptions, data?: ListDataSource[]) =>
    setState(draft => {
        draft.listVisible = typeof data?.length === 'number' && data?.length !== 0;
    });

const processContainerLayout = ({setState}: ProcessEventOptions, containerCurrent?: View | null) =>
    containerCurrent?.measure((x, y, width, height, pageX, pageY) =>
        setState(draft => {
            const update =
                draft.layout.height !== height ||
                draft.layout.pageX !== pageX ||
                draft.layout.pageY !== pageY ||
                draft.layout.width !== width;

            if (update) {
                draft.layout = {
                    height,
                    pageX,
                    pageY,
                    width,
                    x,
                    y,
                };

                draft.status === 'idle' && (draft.status = 'succeeded');
            }
        }),
    );

const processEmit = (element: React.JSX.Element, {id, status, listVisible}: ProcessEmitOptions) =>
    status === 'succeeded' &&
    typeof listVisible === 'boolean' &&
    emitter.emit('modal', {id: `search__list--${id}`, element});

const processUnmount = (id: string) =>
    emitter.emit('modal', {id: `search__list--${id}`, element: undefined});

const renderTextInput = ({id, ...props}: RenderTextInputOptions) => (
    <TextField testID={`search__control--${id}`}>
        <Input
            {...props}
            testID={`search__input--${id}`}
            /**
             * enableFocusRing is used to disable the focus style in macOS,
             * this parameter has been implemented and is available.
             * However, react-native-macos does not have an official typescript declaration for this parameter,
             * so using it directly in a typescript will result in an undefined parameter.
             */
            // @ts-ignore
            enableFocusRing={false}
        />
    </TextField>
);

const AnimatedSearchList = Animated.createAnimatedComponent(SearchList);
const renderSearchList = ({
    activeKey,
    containerHeight,
    containerPageX,
    containerPageY,
    data,
    defaultActiveKey,
    id,
    onActive,
    renderStyle,
    visible,
}: RenderSearchListOptions) => {
    const {height, width} = renderStyle;

    return (
        <AnimatedSearchList
            containerHeight={containerHeight}
            containerPageX={containerPageX}
            containerPageY={containerPageY}
            renderStyle={{width}}
            style={{height}}
            testID={`search__list--${id}`}
            visible={visible}>
            <List
                activeKey={activeKey}
                data={data}
                defaultActiveKey={defaultActiveKey}
                onActive={onActive}
            />
        </AnimatedSearchList>
    );
};

export const SearchBase = forwardRef<TextInput, SearchBaseProps>(
    (
        {
            activeKey,
            data: dataSources,
            defaultActiveKey,
            defaultValue,
            leading,
            onActive,
            onChangeText: onChangeTextSource,
            placeholder,
            render,
            trailing,
            value: valueSource,
            ...textInputProps
        },
        ref,
    ) => {
        const [{value, status, data, eventName, layout, listVisible, state}, setState] =
            useImmer<InitialState>({
                data: [],
                eventName: 'none',
                layout: {} as InitialState['layout'],
                listVisible: undefined,
                state: 'enabled',
                status: 'idle',
                value: '',
            });

        const [{listHeight}] = useAnimated({listVisible});
        const containerRef = useRef<View>(null);
        const id = useId();
        const inputRef = useRef<TextInput>(null);
        const theme = useTheme();
        const placeholderTextColor = theme.palette.surface.onSurfaceVariant;
        const underlayColor = theme.palette.surface.onSurface;
        const onStateChange = useCallback(
            (nextState: State, options = {} as OnStateChangeOptions) =>
                processStateChange(nextState, {...options, ref: inputRef, setState}),
            [setState],
        );

        const [{onBlur, onFocus, ...onEvent}] = useOnEvent({...textInputProps, onStateChange});
        const onChangeText = useCallback(
            (text?: string) =>
                processChangeText(
                    {
                        data: dataSources,
                        onChangeText: onChangeTextSource,
                        setState,
                    },
                    text,
                ),
            [dataSources, onChangeTextSource, setState],
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
                onBlur,
                onChangeText,
                onFocus,
                placeholder,
                placeholderTextColor,
                textInputProps,
                value,
            ],
        );

        const searchList = useMemo(
            () =>
                renderSearchList({
                    activeKey,
                    containerHeight: layout.height,
                    containerPageX: layout.pageX,
                    containerPageY: layout.pageY,
                    data,
                    defaultActiveKey,
                    id,
                    onActive,
                    renderStyle: {height: listHeight, width: layout.width},
                }),
            [activeKey, data, defaultActiveKey, id, layout, listHeight, onActive],
        );

        useImperativeHandle(
            ref,
            () => (inputRef?.current ? inputRef?.current : {}) as TextInput,
            [],
        );

        useEffect(() => {
            onChangeText(valueSource ?? defaultValue);
        }, [valueSource, defaultValue, onChangeText]);

        useEffect(() => {
            processListVisible({setState, state}, data);
        }, [data, setState, state]);

        useEffect(() => {
            processContainerLayout({setState}, containerRef?.current);
        }, [setState]);

        useEffect(() => {
            processEmit(searchList, {status, id, listVisible});

            return () => processUnmount(id);
        }, [id, listVisible, searchList, status]);

        return render({
            containerRef,
            data,
            eventName,
            id,
            input,
            layout,
            leading,
            listVisible,
            onActive,
            onEvent: {...onEvent},
            placeholder,
            trailing,
            underlayColor,
            iconRenderStyle: {
                height: theme.adaptSize(theme.spacing.large),
                width: theme.adaptSize(theme.spacing.large),
            },
        });
    },
);
