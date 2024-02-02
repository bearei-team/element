import {useEffect, useId, useMemo} from 'react';
import {Updater, useImmer} from 'use-immer';
import {ComponentStatus} from '../Common/interface';
import {FormProps} from './Form';
import {FormItem} from './FormItem/FormItem';
import {FormStore, Store} from './formStore';
import {useForm} from './useForm';
import {FormContext} from './useFormContext';

export type RenderProps<T extends Store> = FormProps<T>;
export interface FormBaseProps<T extends Store> extends FormProps<T> {
    render: (props: RenderProps<T>) => React.JSX.Element;
}

export interface ProcessEventOptions {
    setState: Updater<typeof initialState>;
}

export type ProcessInitOptions = ProcessEventOptions &
    Pick<FormStore<any>, 'setInitialValue'> &
    Pick<FormBaseProps<Store>, 'initialValue'>;

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

const initialState = {
    status: 'idle' as ComponentStatus,
};

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
    const [{status}, setState] = useImmer(initialState);
    const [formStore] = useForm<T>(form);
    const {setCallback, setInitialValue} = formStore;
    const id = useId();
    const children = useMemo(
        () =>
            status === 'succeeded' &&
            items?.map((item, index) => (
                <FormItem {...item} key={(item.name ?? index).toString()} />
            )),
        [items, status],
    );

    useEffect(() => {
        setCallback({onFinish, onFinishFailed, onValueChange});
    }, [onFinish, onFinishFailed, onValueChange, setCallback]);

    useEffect(() => {
        processInit(status, {initialValue, setInitialValue, setState});
    }, [initialValue, setInitialValue, setState, status]);

    if (!children) {
        return <></>;
    }

    return render({
        ...renderProps,
        children: (
            <FormContext.Provider value={formStore as FormStore<Store>}>
                {children}
            </FormContext.Provider>
        ),
        id,
    });
};
