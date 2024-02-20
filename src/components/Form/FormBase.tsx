import {useEffect, useId, useMemo} from 'react';
import {Updater, useImmer} from 'use-immer';
import {ComponentStatus} from '../Common/interface';
import {FormProps} from './Form';
import {FormItem} from './FormItem/FormItem';
import {FormStore, Store} from './formStore';
import {useForm} from './useForm';

export type RenderProps<T extends Store> = FormProps<T>;
export interface FormBaseProps<T extends Store> extends FormProps<T> {
    render: (props: RenderProps<T>) => React.JSX.Element;
}

export interface InitialState {
    status: ComponentStatus;
}

export interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

export type ProcessInitOptions = ProcessEventOptions &
    Pick<FormStore<any>, 'setInitialValue'> &
    Pick<FormBaseProps<Store>, 'initialValue'>;

export type ProcessCallbackOptions = Pick<
    FormProps<any>,
    'onFinish' | 'onFinishFailed' | 'onValueChange'
> &
    Pick<FormStore<Store>, 'setCallback'>;

const processInit = (
    status: ComponentStatus,
    {initialValue, setInitialValue, setState}: ProcessInitOptions,
) => {
    if (status !== 'idle') {
        return;
    }

    initialValue && setInitialValue(initialValue);
    setState(draft => {
        draft.status = 'succeeded';
    });
};

const processCallback = ({
    onFinish,
    onFinishFailed,
    onValueChange,
    setCallback,
}: ProcessCallbackOptions) => setCallback({onFinish, onFinishFailed, onValueChange});

const renderChildren = (status: ComponentStatus, {items}: Pick<FormBaseProps<{}>, 'items'>) =>
    status === 'succeeded' &&
    items?.map((item, index) => <FormItem {...item} key={(item.name ?? index).toString()} />);

export const FormBase = <T extends Store = Store>({
    form,
    initialValue,
    items,
    onFinish,
    onFinishFailed,
    onValueChange,
    render,
    ...renderProps
}: FormBaseProps<T>) => {
    const [{status}, setState] = useImmer<InitialState>({status: 'idle'});
    const [formStore] = useForm<T>(form);
    const {setCallback, setInitialValue} = formStore;
    const id = useId();
    const children = useMemo(() => renderChildren(status, {items}), [items, status]);

    useEffect(() => {
        processCallback({onFinish, onFinishFailed, onValueChange, setCallback});
    }, [onFinish, onFinishFailed, onValueChange, setCallback]);

    useEffect(() => {
        processInit(status, {initialValue, setInitialValue, setState});
    }, [initialValue, setInitialValue, setState, status]);

    if (!children) {
        return <></>;
    }

    return render({
        ...renderProps,
        children,
        form: formStore,
        id,
    });
};
