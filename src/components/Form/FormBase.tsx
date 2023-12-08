import {useEffect, useId} from 'react';
import {useImmer} from 'use-immer';
import {FormProps} from './Form';
import {FormStore, Store} from './formStore';
import {useForm} from './useForm';
import {FormContext} from './useFormContext';

export type RenderProps<T extends Store> = FormProps<T>;
export interface FormBaseProps<T extends Store> extends FormProps<T> {
    render: (props: RenderProps<T>) => React.JSX.Element;
}

export const FormBase = <T extends Store>(props: FormBaseProps<T>) => {
    const {
        children,
        form,
        initialValue,
        onFinish,
        onFinishFailed,
        onValueChange,
        render,
        ...renderProps
    } = props;

    const [formStore] = useForm<T>(form);
    const [status, setStatus] = useImmer('idle');
    const {setCallback, setInitialValue} = formStore;
    const id = useId();

    useEffect(() => {
        setCallback({onFinish, onFinishFailed, onValueChange});
    }, [onFinish, onFinishFailed, onValueChange, setCallback]);

    useEffect(() => {
        if (status === 'idle') {
            setInitialValue(initialValue, status !== 'idle');
            setStatus(() => 'succeeded');
        }
    }, [initialValue, setInitialValue, setStatus, status]);

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
