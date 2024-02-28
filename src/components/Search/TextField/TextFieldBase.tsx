import {FC, RefAttributes, RefObject, useCallback, useEffect, useMemo, useRef} from 'react';
import {
    Animated,
    LayoutRectangle,
    PressableProps,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
    useWindowDimensions,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater, useImmer} from 'use-immer';
import {emitter} from '../../../context/ModalProvider';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../../hooks/useOnEvent';
import {ComponentStatus, EventName, State} from '../../Common/interface';
import {ListDataSource, ListProps} from '../../List/List';
import {Input} from '../../TextField/TextField.styles';
import {TextField} from './TextField.styles';
import {useAnimated} from './useAnimated';

type BaseProps = Partial<
    TextInputProps &
        Pick<ListProps, 'activeKey' | 'onActive' | 'data' | 'defaultActiveKey'> &
        PressableProps &
        RefAttributes<TextInput>
>;

export interface TextFieldProps extends BaseProps {
    containerCurrent: View | null;
    disabled?: boolean;
    leading?: React.JSX.Element;
    listVisible?: boolean;
    trailing?: React.JSX.Element;
}

export interface RenderProps extends Omit<TextFieldProps, 'containerCurrent'> {
    containerLayout: LayoutRectangle & {pageX: number; pageY: number};
    eventName: EventName;
    input: React.JSX.Element;
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle>;
    underlayColor: string;
}

interface TextFieldBaseProps extends TextFieldProps {
    render: (props: RenderProps) => React.JSX.Element;
}

type RenderTextInputOptions = Omit<TextFieldProps, 'containerCurrent' | 'windowDimensions'>;
interface InitialState {
    containerLayout: LayoutRectangle & {pageX: number; pageY: number};
    data: ListDataSource[];
    eventName: EventName;
    listVisible?: boolean;
    state: State;
    status: ComponentStatus;
    value?: string;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessChangeTextOptions = Pick<RenderProps, 'data' | 'onChangeText'> & ProcessEventOptions;
type ProcessEmitOptions = Pick<InitialState, 'status'> & Pick<RenderProps, 'id'>;
type ProcessListVisibleOptions = ProcessEventOptions & Pick<InitialState, 'state'>;
type ProcessStateChangeOptions = {ref?: RefObject<TextInput>} & ProcessEventOptions &
    OnStateChangeOptions;

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
    const matchData = text
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

        draft.data = matchData;
        onChangeText?.(text);
    });
};

const processListVisible = ({setState}: ProcessListVisibleOptions, data?: ListDataSource[]) =>
    setState(draft => {
        draft.listVisible = typeof data?.length === 'number' && data?.length !== 0;
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
    status === 'succeeded' && emitter.emit('modal', {id: `search__TextField--${id}`, element});

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

export const TextFieldBase: FC<TextFieldBaseProps> = ({
    containerCurrent,
    data: dataSources,
    id,
    leading,
    onActive,
    placeholder,
    ref,
    render,
    trailing,
    ...textInputProps
}) => {
    const [{status, data, eventName, containerLayout, listVisible, state}, setState] =
        useImmer<InitialState>({
            data: [],
            eventName: 'none',
            containerLayout: {} as InitialState['containerLayout'],
            listVisible: undefined,
            state: 'enabled',
            status: 'idle',
        });

    const windowDimensions = useWindowDimensions();
    const [{height}] = useAnimated({listVisible});
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

    const textField = useMemo(
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
                listVisible,
            }),
        [
            render,
            containerLayout,
            data,
            eventName,
            id,
            input,
            leading,
            onBlur,
            onFocus,
            onEvent,
            onActive,
            placeholder,
            height,
            trailing,
            underlayColor,
            listVisible,
        ],
    );

    useEffect(() => {
        processListVisible({setState, state}, data);
    }, [data, setState, state]);

    useEffect(() => {
        processContainerLayout(containerCurrent, {setState});
    }, [containerCurrent, setState, windowDimensions]);

    useEffect(() => {
        processEmit(textField, {id, status});
    }, [id, textField, status]);

    return <></>;
};
