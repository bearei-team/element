import {RefAttributes, useEffect, useId, useMemo} from 'react';
import {Updater, useImmer} from 'use-immer';
import {ComponentStatus} from '../Common/interface';

import {View, ViewProps} from 'react-native';
import {FormItem, FormItemProps} from './FormItem/FormItem';
import {Callback, FormStore, Store} from './formStore';
import {useForm} from './useForm';

/**
 * TODO: vertical
 */
export interface FormProps<T extends Store = Store>
    extends Partial<ViewProps & RefAttributes<View> & Callback<T>> {
    form?: FormStore<T>;
    initialValue?: T;
    items?: FormItemProps[];
    layout?: 'horizontal' | 'vertical';
}

export type RenderProps<T extends Store> = FormProps<T>;
interface FormBaseProps<T extends Store> extends FormProps<T> {
    render: (props: RenderProps<T>) => React.JSX.Element;
}

interface InitialState {
    status: ComponentStatus;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessInitOptions = ProcessEventOptions &
    Pick<FormStore<any>, 'setInitialValue'> &
    Pick<FormBaseProps<Store>, 'initialValue'>;

type ProcessCallbackOptions = Pick<
    FormProps<any>,
    'onFinish' | 'onFinishFailed' | 'onValueChange'
> &
    Pick<FormStore<Store>, 'setCallback'>;

type RenderChildrenOptions = Pick<FormBaseProps<{}>, 'items' | 'id'>;

const processInit = ({initialValue, setInitialValue, setState}: ProcessInitOptions) =>
    setState(draft => {
        if (draft.status !== 'idle') {
            return;
        }

        initialValue && setInitialValue(initialValue);
        draft.status = 'succeeded';
    });

const processCallback = ({
    onFinish,
    onFinishFailed,
    onValueChange,
    setCallback,
}: ProcessCallbackOptions) => setCallback({onFinish, onFinishFailed, onValueChange});

const renderChildren = (status: ComponentStatus, {items, id}: RenderChildrenOptions) =>
    status === 'succeeded' &&
    items?.map((item, index) => <FormItem {...item} key={item.name ?? index} id={id} />);

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
    const children = useMemo(() => renderChildren(status, {items, id}), [id, items, status]);

    useEffect(() => {
        processCallback({onFinish, onFinishFailed, onValueChange, setCallback});
    }, [onFinish, onFinishFailed, onValueChange, setCallback]);

    useEffect(() => {
        processInit({initialValue, setInitialValue, setState});
    }, [initialValue, setInitialValue, setState, status]);

    if (!children || status === 'idle') {
        return <></>;
    }

    return render({
        ...renderProps,
        children,
        form: formStore,
        id,
    });
};
