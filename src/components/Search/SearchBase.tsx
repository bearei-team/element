import {FC, RefObject, useEffect, useId, useMemo, useRef} from 'react';
import {Animated, LayoutRectangle, TextInput, View} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Updater, useImmer} from 'use-immer';
import {emitter} from '../../context/ModalProvider';
import {HOOK} from '../../hooks/hook';
import {OnEvent, OnStateChangeOptions} from '../../hooks/useOnEvent';
import {EventName, State} from '../Common/interface';
import {Divider} from '../Divider/Divider';
import {Hovered} from '../Hovered/Hovered';
import {Icon} from '../Icon/Icon';
import {List, ListDataSource} from '../List/List';
import {SearchProps} from './Search';
import {Content, Header, Inner, Input, LeadingIcon, TrailingIcon} from './Search.styles';
import {useAnimated} from './useAnimated';

export interface RenderProps extends SearchProps {
    containerRef: RefObject<View>;
    onEvent: Omit<OnEvent, 'onBlur' | 'onFocus'>;
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

export type ProcessListActiveOptions = Pick<RenderProps, 'data'> & ProcessEventOptions;
export type ProcessStateOptions = Pick<OnStateChangeOptions, 'eventName'> & ProcessEventOptions;
export type ProcessStateChangeOptions = {ref?: RefObject<TextInput>} & ProcessEventOptions;

const processListActive =
    ({data, setState}: ProcessListActiveOptions) =>
    (key?: string) => {
        const nextValue = data?.find(datum => datum.key === key)?.headline;

        if (nextValue) {
            setState(draft => {
                draft.value = nextValue;
            });
        }
    };

const processFocus = (ref?: RefObject<TextInput>) => ref?.current?.focus();
const processState = (nextState: State, {eventName = 'none', setState}: ProcessStateOptions) => {
    setState(draft => {
        if (draft.state === 'focused') {
            if (eventName === 'blur') {
                draft.eventName = eventName;
                draft.state = nextState;
            }

            return;
        }

        draft.eventName = eventName;
        draft.state = nextState;
    });
};

const processStateChange =
    ({ref, setState}: ProcessStateChangeOptions) =>
    (state: State, {eventName} = {} as OnStateChangeOptions) => {
        const nextEvent = {
            pressOut: () => processFocus(ref),
            focus: () => processFocus(ref),
        };

        nextEvent[eventName as keyof typeof nextEvent]?.();

        processState(state, {eventName, setState});
    };

const renderTextInput = (options: RenderTextInputOptions) => (
    <Input
        {...options}
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
);

const initialState = {
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle & {pageX: number; pageY: number},
    listVisible: false,
    state: 'enabled' as State,
    value: undefined as string | undefined,
};

const AnimatedInner = Animated.createAnimatedComponent(Inner);
export const SearchBase: FC<SearchBaseProps> = ({
    data,
    leadingIcon,
    placeholder,
    ref,
    render,
    value,
    trailingIcon,
    ...textInputProps
}) => {
    const [{layout, listVisible, eventName, state}, setState] = useImmer(initialState);
    const [{innerHeight}] = useAnimated({listVisible});
    const containerRef = useRef<View>(null);
    const id = useId();
    const theme = useTheme();
    const textFieldRef = useRef<TextInput>(null);
    const inputRef = (ref ?? textFieldRef) as RefObject<TextInput>;
    const placeholderTextColor = theme.palette.surface.onSurfaceVariant;
    const underlayColor = theme.palette.surface.onSurface;
    const onStateChange = useMemo(
        () => processStateChange({ref: textFieldRef, setState}),
        [setState],
    );

    const [{onBlur, onFocus, ...onEvent}] = HOOK.useOnEvent({
        ...textInputProps,
        onStateChange,
    });

    const onListActive = useMemo(() => processListActive({data, setState}), [data, setState]);
    const input = useMemo(
        () =>
            renderTextInput({
                ...textInputProps,
                onBlur,
                onFocus,
                placeholder,
                placeholderTextColor,
                ref: inputRef,
                testID: `search__input--${id}`,
                value,
            }),
        [id, inputRef, onBlur, onFocus, placeholder, placeholderTextColor, textInputProps, value],
    );

    const inner = useMemo(() => {
        const shape = 'extraLarge';
        const {width, pageX, pageY, height} = layout;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {onLayout: _, ...onHeaderEvent} = onEvent;

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
                    {...onHeaderEvent}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    accessibilityLabel={placeholder}
                    accessibilityRole="keyboardkey"
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
                    onActive={onListActive}
                    data={data}
                    style={{backgroundColor: theme.color.rgba(theme.palette.surface.surface, 0)}}
                />
            </AnimatedInner>
        );
    }, [
        data,
        eventName,
        onListActive,
        id,
        innerHeight,
        input,
        layout,
        leadingIcon,
        listVisible,
        onBlur,
        onEvent,
        onFocus,
        placeholder,
        theme.color,
        theme.palette.surface.surface,
        trailingIcon,
        underlayColor,
    ]);

    useEffect(() => {
        setState(draft => {
            draft.listVisible = data?.length !== 0 && state === 'focused';
        });
    }, [data?.length, setState, state]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.measure((x, y, width, height, pageX, pageY) => {
                setState(draft => {
                    draft.layout = {x, y, width, height, pageX, pageY};
                });
            });
        }
    }, [setState]);

    useEffect(() => {
        emitter.emit('sheet', {id, element: inner});
    }, [id, inner]);

    return render({
        containerRef,
        data,
        id,
        placeholder,
        onEvent,
    });
};
