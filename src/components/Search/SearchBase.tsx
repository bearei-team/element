import {FC, RefObject, useCallback, useId, useRef} from 'react';
import {View} from 'react-native';
import {Updater, useImmer} from 'use-immer';
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

    return render({
        ...renderProps,
        containerCurrent: containerRef.current,
        containerRef,
        id,
        onEvent,
        status,
    });
};
