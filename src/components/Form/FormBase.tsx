import {useCallback, useEffect, useId, useMemo} from 'react';
import {useImmer} from 'use-immer';
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

const initialState = {
    status: 'idle' as ComponentStatus,
};

export const FormBase = <T extends Store = Store>(props: FormBaseProps<T>) => {
    const {
        form,
        initialValue,
        items,
        onFinish,
        onFinishFailed,
        onValueChange,
        render,
        ...renderProps
    } = props;

    const [{status}, setState] = useImmer(initialState);
    const {form: formStore} = useForm<T>(form);
    const {setCallback, setInitialValue} = formStore;
    const id = useId();

    const renderChildren = useCallback(
        () =>
            items?.map((item, index) => (
                <FormItem {...item} key={(item.name ?? index).toString()} />
            )),
        [items],
    );

    const children = useMemo(() => renderChildren(), [renderChildren]);

    useEffect(() => {
        setCallback({onFinish, onFinishFailed, onValueChange});
    }, [onFinish, onFinishFailed, onValueChange, setCallback]);

    useEffect(() => {
        if (status === 'idle') {
            setInitialValue(initialValue, status !== 'idle');
            setState(draft => {
                draft.status = 'succeeded';
            });
        }
    }, [initialValue, setInitialValue, setState, status]);

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
