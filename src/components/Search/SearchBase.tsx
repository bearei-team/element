import {FC, RefAttributes, RefObject, useCallback, useId, useRef} from 'react';
import {
    PressableProps,
    ScaledSize,
    TextInput,
    TextInputProps,
    TouchableWithoutFeedbackProps,
    View,
    useWindowDimensions,
} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {ComponentStatus, State} from '../Common/interface';
import {ListProps} from '../List/List';

export interface SearchProps
    extends Partial<
        TextInputProps &
            Pick<ListProps, 'activeKey' | 'onActive' | 'data' | 'defaultActiveKey'> &
            PressableProps &
            RefAttributes<TextInput> &
            TouchableWithoutFeedbackProps
    > {
    leading?: React.JSX.Element;
    listVisible?: boolean;
    trailing?: React.JSX.Element;
}

export interface RenderProps extends SearchProps {
    containerCurrent: View | null;
    containerRef: RefObject<View>;
    onEvent: OnEvent;
    status: ComponentStatus;
    windowDimensions: ScaledSize;
}

interface SearchBaseProps extends SearchProps {
    render: (props: RenderProps) => React.JSX.Element;
}

interface InitialState {
    status: ComponentStatus;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessStateChangeOptions = OnStateChangeOptions & ProcessEventOptions;

const processLayout = ({setState}: ProcessEventOptions) => {
    setState(draft => {
        draft.status = 'succeeded';
    });
};

const processStateChange = ({eventName, setState}: ProcessStateChangeOptions) =>
    eventName === 'layout' && processLayout({setState});

export const SearchBase: FC<SearchBaseProps> = ({render, ...renderProps}) => {
    const [{status}, setState] = useImmer<InitialState>({
        status: 'idle',
    });

    const containerRef = useRef<View>(null);
    const id = useId();
    const windowDimensions = useWindowDimensions();
    const onStateChange = useCallback(
        (_state: State, options = {} as OnStateChangeOptions) =>
            processStateChange({...options, setState}),
        [setState],
    );

    const [onEvent] = useOnEvent({...renderProps, onStateChange});

    return render({
        ...renderProps,
        containerCurrent: containerRef.current,
        containerRef,
        id,
        windowDimensions,
        status,
        onEvent,
    });
};
