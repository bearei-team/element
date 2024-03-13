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
import {ComponentStatus, EventName, Size, State} from '../Common/interface';
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
    size?: Size;

    /**
     * The modal type has a problem with mouseover events being passed through to lower level
     * elements in macOS. This problem is caused by the fact that react-native-macos does not
     * implement the native modal and some of the mechanisms of the macos component itself.
     */
    type?: 'standard' | 'modal';
}

export interface RenderProps extends SearchProps {
    containerRef: RefObject<View>;
    eventName: EventName;
    iconRenderStyle: {width: number; height: number};
    input: React.JSX.Element;
    layout: LayoutRectangle;
    listVisible?: boolean;
    onEvent: Omit<OnEvent, 'onBlur' | 'onFocus'>;
    searchList?: React.JSX.Element;
    underlayColor: string;
    listData: ListDataSource[];
}

interface SearchBaseProps extends SearchProps {
    render: (props: RenderProps) => React.JSX.Element;
}

interface InitialState {
    data: ListDataSource[];
    listData: ListDataSource[];
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
type ProcessEmitOptions = Pick<InitialState, 'status' | 'listVisible'> &
    Pick<RenderProps, 'id' | 'type'>;

type ProcessStateChangeOptions = {ref?: RefObject<TextInput>} & ProcessEventOptions &
    OnStateChangeOptions;

type ProcessContainerLayoutOptions = ProcessEventOptions & Pick<InitialState, 'listVisible'>;
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

const processListVisible = ({setState}: ProcessEventOptions, data?: ListDataSource[]) =>
    setState(draft => {
        if (typeof data?.length === 'number' && data?.length !== 0) {
            draft.listVisible = true;
            draft.listData = data;

            return;
        }

        draft.listVisible = false;
    });

const processListClosed = ({setState}: ProcessEventOptions, visible?: boolean) => {
    typeof visible === 'boolean' &&
        setState(draft => {
            draft.listData !== draft.data && (draft.listData = draft.data);
        });
};

const processContainerLayout = (
    {setState, listVisible}: ProcessContainerLayoutOptions,
    containerCurrent?: View | null,
) =>
    listVisible &&
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

const processEmit = (
    element: React.JSX.Element,
    {id, status, listVisible, type}: ProcessEmitOptions,
) =>
    status === 'succeeded' &&
    typeof listVisible === 'boolean' &&
    type === 'modal' &&
    emitter.emit('modal', {id: `search__list--${id}`, element});

const processUnmount = (id: string, {type}: Pick<RenderProps, 'type'>) =>
    type === 'modal' && emitter.emit('modal', {id: `search__list--${id}`, element: undefined});

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
    type,
}: RenderSearchListOptions) => {
    const {height, width} = renderStyle;

    return (
        <AnimatedSearchList
            containerHeight={containerHeight}
            containerPageX={containerPageX}
            containerPageY={containerPageY}
            renderStyle={{width}}
            shape="extraLargeBottom"
            style={{height}}
            testID={`search__list--${id}`}
            type={type}
            visible={!!data?.length}>
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
            size,
            type = 'modal',
            ...textInputProps
        },
        ref,
    ) => {
        const [{value, status, data, eventName, layout, listVisible, listData}, setState] =
            useImmer<InitialState>({
                data: [],
                listData: [],
                eventName: 'none',
                layout: {} as InitialState['layout'],
                listVisible: undefined,
                state: 'enabled',
                status: 'idle',
                value: '',
            });

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

        const onListClosed = useCallback(
            (visible?: boolean) => processListClosed({setState}, visible),
            [setState],
        );

        const [{listHeight}] = useAnimated({listVisible, onListClosed});
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

        const onUnmount = useCallback(() => processUnmount(id, {type}), [id, type]);
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
                    size,
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
                size,
            ],
        );

        const searchList = useMemo(
            () =>
                renderSearchList({
                    activeKey,
                    containerHeight: layout.height,
                    containerPageX: layout.pageX,
                    containerPageY: layout.pageY,
                    data: listData,
                    defaultActiveKey,
                    id,
                    onActive,
                    renderStyle: {height: listHeight, width: layout.width},
                    type,
                }),
            [
                activeKey,
                listData,
                defaultActiveKey,
                id,
                layout.height,
                layout.pageX,
                layout.pageY,
                layout.width,
                listHeight,
                onActive,
                type,
            ],
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
            processListVisible({setState}, data);
        }, [data, setState]);

        useEffect(() => {
            processContainerLayout({setState, listVisible}, containerRef.current);
        }, [setState, listVisible]);

        useEffect(() => {
            processEmit(searchList, {status, id, listVisible, type});

            return () => {
                onUnmount();
            };
        }, [id, listVisible, onUnmount, searchList, status, type]);

        return render({
            containerRef,
            data,
            eventName,
            iconRenderStyle:
                size === 'small'
                    ? {
                          height: theme.adaptSize(theme.spacing.large - 4),
                          width: theme.adaptSize(theme.spacing.large - 4),
                      }
                    : {
                          height: theme.adaptSize(theme.spacing.large),
                          width: theme.adaptSize(theme.spacing.large),
                      },
            id,
            input,
            layout,
            leading,
            listData,
            onActive,
            onEvent: {...onEvent},
            placeholder,
            searchList,
            size,
            trailing,
            type,
            underlayColor,
        });
    },
);
