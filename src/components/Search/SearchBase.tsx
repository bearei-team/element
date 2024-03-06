import {FC, RefAttributes, RefObject, useCallback, useEffect, useId, useMemo, useRef} from 'react';
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
    onEvent: OnEvent;
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
};

const processFocus = (ref?: RefObject<TextInput>) => ref?.current?.focus();
const processStateChange = (
    state: State,
    {eventName, ref, setState}: ProcessStateChangeOptions,
) => {
    const nextEvent = {
        focus: () => processFocus(ref),
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
    text: string,
    {setState, data = [], onChangeText}: ProcessChangeTextOptions,
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
    });

    onChangeText?.(text);
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
}: RenderSearchListOptions) => {
    const {height, width} = renderStyle;

    return (
        <AnimatedSearchList
            containerHeight={containerHeight}
            containerPageX={containerPageX}
            containerPageY={containerPageY}
            renderStyle={{width}}
            style={{height}}
            testID={`search__list--${id}`}>
            <List
                activeKey={activeKey}
                data={data}
                defaultActiveKey={defaultActiveKey}
                onActive={onActive}
            />
        </AnimatedSearchList>
    );
};
export const SearchBase: FC<SearchBaseProps> = ({
    activeKey,
    data: dataSources,
    defaultActiveKey,
    leading,
    onActive,
    placeholder,
    ref,
    render,
    trailing,
    ...textInputProps
}) => {
    const [{status, data, eventName, layout, listVisible, state}, setState] =
        useImmer<InitialState>({
            data: [],
            eventName: 'none',
            layout: {} as InitialState['layout'],
            listVisible: undefined,
            state: 'enabled',
            status: 'idle',
        });

    const [{listHeight}] = useAnimated({listVisible});
    const containerRef = useRef<View>(null);
    const id = useId();
    const searchRef = useRef<TextInput>(null);
    const inputRef = (ref ?? searchRef) as RefObject<TextInput>;
    const theme = useTheme();
    const placeholderTextColor = theme.palette.surface.onSurfaceVariant;
    const underlayColor = theme.palette.surface.onSurface;
    const onStateChange = useCallback(
        (nextState: State, options = {} as OnStateChangeOptions) =>
            processStateChange(nextState, {...options, ref: searchRef, setState}),
        [setState],
    );

    const [{onBlur, onFocus, ...onEvent}] = useOnEvent({...textInputProps, onStateChange});
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

    useEffect(() => {
        processListVisible({setState, state}, data);
    }, [data, setState, state]);

    useEffect(() => {
        processContainerLayout({setState}, containerRef?.current);
    }, [containerRef, setState, listVisible]);

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
        onEvent: {onBlur, onFocus, ...onEvent},
        placeholder,
        trailing,
        underlayColor,
        iconRenderStyle: {
            height: theme.adaptSize(theme.spacing.large),
            width: theme.adaptSize(theme.spacing.large),
        },
    });
};
