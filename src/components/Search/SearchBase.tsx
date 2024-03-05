import {FC, RefObject, useCallback, useEffect, useId, useRef} from 'react';
import {View} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {emitter} from '../../context/ModalProvider';
import {OnEvent, OnStateChangeOptions, useOnEvent} from '../../hooks/useOnEvent';
import {ComponentStatus, State} from '../Common/interface';
import {TextFieldProps} from './TextField/TextField';

export type SearchProps = TextFieldProps;
export interface RenderProps extends SearchProps {
    containerRef: RefObject<View>;
    status: ComponentStatus;
    onEvent: OnEvent;
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

const processUnmount = (id: string) =>
    emitter.emit('modal', {id: `search__TextField--${id}`, element: undefined});

export const SearchBase: FC<SearchBaseProps> = ({render, ...renderProps}) => {
    const [{status}, setState] = useImmer<InitialState>({status: 'idle'});
    const containerRef = useRef<View>(null);
    const id = useId();
    const onStateChange = useCallback(
        (_state: State, options = {} as OnStateChangeOptions) =>
            processStateChange({...options, setState}),
        [setState],
    );

    const [onEvent] = useOnEvent({...renderProps, onStateChange});

    useEffect(() => {
        return () => processUnmount(id);
    }, [id]);

    return render({
        ...renderProps,
        containerCurrent: containerRef.current,
        containerRef,
        id,
        onEvent,
        status,
    });
};
