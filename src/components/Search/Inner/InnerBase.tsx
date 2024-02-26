import {FC, RefObject, useCallback, useEffect, useId, useMemo, useRef} from 'react';
import {
    Animated,
    LayoutRectangle,
    ScaledSize,
    TextInput,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater, useImmer} from 'use-immer';
import {emitter} from '../../../context/ModalProvider';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../../hooks/useOnEvent';
import {ComponentStatus, EventName, State} from '../../Common/interface';
import {ListDataSource} from '../../List/List';
import {Input} from '../../TextField/TextField.styles';
import {SearchProps} from '../Search';
import {TextField} from './Inner.styles';
import {useAnimated} from './useAnimated';

export interface InnerProps extends SearchProps {
    containerCurrent: View | null;
    windowDimensions: ScaledSize;
}

export interface RenderProps extends Omit<InnerProps, 'containerCurrent' | 'windowDimensions'> {
    containerLayout: LayoutRectangle & {pageX: number; pageY: number};
    eventName: EventName;
    input: React.JSX.Element;
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle>;
    underlayColor: string;
}

interface InnerBaseProps extends InnerProps {
    render: (props: RenderProps) => React.JSX.Element;
}

type RenderTextInputOptions = Omit<InnerProps, 'containerCurrent' | 'windowDimensions'>;
interface InitialState {
    containerLayout: LayoutRectangle & {pageX: number; pageY: number};
    data: ListDataSource[];
    eventName: EventName;
    listVisible: boolean;
    state: State;
    status: ComponentStatus;
    value?: string;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessChangeTextOptions = Pick<RenderProps, 'data' | 'onChangeText'> & ProcessEventOptions;
interface ProcessEmitOptions extends Pick<InitialState, 'status'> {
    id: string;
}

type ProcessListActiveOptions = Pick<RenderProps, 'data' | 'onActive'> & ProcessEventOptions;
type ProcessListVisibleOptions = ProcessEventOptions & {state: State};
type ProcessStateChangeOptions = {ref?: RefObject<TextInput>} & ProcessEventOptions &
    OnStateChangeOptions;

type ProcessStateOptions = ProcessEventOptions & Pick<OnStateChangeOptions, 'eventName'>;

const processListActive = ({data, setState, onActive}: ProcessListActiveOptions, key?: string) => {
    const nextValue = data?.find(datum => datum.key === key)?.headline;

    nextValue &&
        setState(draft => {
            draft.value = nextValue;
            onActive?.(key);
        });
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

const processStateChange = (
    state: State,
    {eventName, ref, setState}: ProcessStateChangeOptions,
) => {
    const nextEvent = {
        focus: () => processFocus(ref),
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

const processContainerLayout = (containerCurrent: View | null, {setState}: ProcessEventOptions) =>
    containerCurrent?.measure((x, y, width, height, pageX, pageY) =>
        setState(draft => {
            draft.containerLayout = {
                height,
                pageX,
                pageY,
                width,
                x,
                y,
            };

            draft.status = 'idle' && (draft.status = 'succeeded');
        }),
    );

const processEmit = (element: React.JSX.Element, {id, status}: ProcessEmitOptions) =>
    status === 'succeeded' && emitter.emit('modal', {id: `search__inner--${id}`, element});

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

export const InnerBase: FC<InnerBaseProps> = ({
    data: dataSources,
    leading,
    onActive: onActiveSource,
    placeholder,
    ref,
    render,
    trailing,
    containerCurrent,
    windowDimensions,
    ...textInputProps
}) => {
    const [{data, eventName, containerLayout, listVisible, state, value, status}, setState] =
        useImmer<InitialState>({
            data: [],
            eventName: 'none',
            containerLayout: {} as InitialState['containerLayout'],
            listVisible: false,
            state: 'enabled',
            status: 'idle',
            value: undefined,
        });

    const [{height}] = useAnimated({listVisible});
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

    const [{onBlur, onFocus, ...onEvent}] = useOnEvent({
        ...textInputProps,
        onStateChange,
    });

    const onActive = useCallback(
        (key?: string) => processListActive({data, setState, onActive: onActiveSource}, key),
        [data, onActiveSource, setState],
    );

    const onChangeText = useCallback(
        (text: string) => processChangeText(text, {data: dataSources, setState}),
        [dataSources, setState],
    );

    const onContainerLayout = useCallback(
        () => processContainerLayout(containerCurrent, {setState}),
        [containerCurrent, setState],
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

    const inner = useMemo(
        () =>
            render({
                containerLayout,
                data,
                eventName,
                id,
                input,
                leading,
                onEvent: {onBlur, onFocus, ...onEvent},
                onActive,
                placeholder,
                renderStyle: {height},
                trailing,
                underlayColor,
            }),
        [
            containerLayout,
            data,
            eventName,
            height,
            id,
            input,
            leading,
            onBlur,
            onEvent,
            onFocus,
            onActive,
            placeholder,
            render,
            trailing,
            underlayColor,
        ],
    );

    useEffect(() => {
        processListVisible({setState, state}, data);
    }, [data, setState, state]);

    useEffect(() => {
        onContainerLayout();
    }, [onContainerLayout, windowDimensions]);

    useEffect(() => {
        processEmit(inner, {id, status});
    }, [id, inner, status]);

    return <></>;
};
