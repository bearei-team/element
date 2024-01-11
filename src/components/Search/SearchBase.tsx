import {
    FC,
    RefObject,
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
} from 'react';
import {
    Animated,
    LayoutRectangle,
    TextInput,
    View,
    ViewStyle,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useImmer} from 'use-immer';
import {HOOK} from '../../hooks/hook';
import {OnEvent, OnStateChangeOptions} from '../../hooks/useOnEvent';
import {AnimatedInterpolation, EventName, State} from '../Common/interface';
import {Icon} from '../Icon/Icon';
import {ListDataSource} from '../List/List';
import {SearchProps} from './Search';
import {Input} from './Search.styles';
import {useAnimated} from './useAnimated';

export interface RenderProps extends SearchProps {
    containerRef: RefObject<View>;
    eventName: EventName;
    listVisible: boolean;
    onEvent: OnEvent;
    onListActive?: (key?: string) => void;
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        height: number;
        innerHeight: AnimatedInterpolation;
        listBackgroundColor: string;
        pageX: number;
        pageY: number;
        width: number;
    };
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
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle & {pageX: number; pageY: number},
    listVisible: false,
    state: 'enabled' as State,
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
        data,
        defaultValue,
        leadingIcon,
        onChangeText,
        placeholder,
        ref,
        render,
        ...renderProps
    } = props;

    const [{value, layout, listVisible, eventName, state}, setState] =
        useImmer(initialState);

    const {innerHeight} = useAnimated({listVisible});
    const containerRef = useRef<View>(null);
    const id = useId();
    const theme = useTheme();
    const textFieldRef = useRef<TextInput>(null);
    const inputRef = (ref ?? textFieldRef) as RefObject<TextInput>;
    const placeholderTextColor = theme.palette.surface.onSurfaceVariant;
    const underlayColor = theme.palette.surface.onSurface;
    const processFocus = useCallback(() => {
        inputRef.current?.focus();
    }, [inputRef]);

    const processState = useCallback(
        (
            nextState: State,
            options: Pick<OnStateChangeOptions, 'eventName'>,
        ) => {
            const {eventName: nextEventName} = options;

            setState(draft => {
                if (draft.state === 'focused') {
                    if (nextEventName === 'blur') {
                        draft.eventName = nextEventName;
                        draft.state = nextState;
                    }

                    return;
                }

                draft.eventName = nextEventName;
                draft.state = nextState;
            });
        },
        [setState],
    );

    const processStateChange = useCallback(
        (nextState: State, options = {} as OnStateChangeOptions) => {
            const {eventName: nextEventName} = options;
            const nextEvent = {
                pressOut: () => {
                    processFocus();
                },
                focus: () => {
                    processFocus();
                },
            };

            nextEvent[nextEventName as keyof typeof nextEvent]?.();

            processState(nextState, {eventName: nextEventName});
        },
        [processFocus, processState],
    );

    const [{onBlur, onFocus, ...onEvent}] = HOOK.useOnEvent({
        ...props,
        onStateChange: processStateChange,
    });

    const handleChangeText = useCallback(
        (text: string) => {
            setState(draft => {
                draft.value = text;
            });

            onChangeText?.(text);
        },
        [onChangeText, setState],
    );

    const handleListActive = useCallback(
        (key?: string) => {
            const nextValue = data?.find(datum => datum.key === key)?.headline;

            if (nextValue) {
                setState(draft => {
                    draft.value = nextValue;
                });
            }
        },
        [data, setState],
    );

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

    useEffect(() => {
        setState(draft => {
            draft.listVisible = data?.length !== 0 && state === 'focused';
        });
    }, [data, setState, state]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.measure(
                (x, y, width, height, pageX, pageY) => {
                    setState(draft => {
                        draft.layout = {x, y, width, height, pageX, pageY};
                    });
                },
            );
        }
    }, [setState]);

    return render({
        ...renderProps,
        children,
        containerRef,
        data,
        eventName,
        id,
        leadingIcon: leadingIcon ?? (
            <Icon type="outlined" name="search" width={24} height={24} />
        ),
        listVisible,
        onEvent: {...onEvent, onBlur, onFocus},
        onListActive: handleListActive,
        placeholder,
        renderStyle: {
            height: layout.height,
            innerHeight,
            pageX: layout.pageX,
            pageY: layout.pageY,
            width: layout.width,
            listBackgroundColor: theme.color.rgba(
                theme.palette.surface.surface,
                0,
            ),
        },
        underlayColor,
    });
};
