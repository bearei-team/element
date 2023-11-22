import {FC, useEffect, useId} from 'react';
import {useImmer} from 'use-immer';
import {FormProps} from './Form';
import {useForm} from './useForm';
import {FormContext} from './useFormContext';

export type RenderProps = FormProps;
export interface BaseFormProps extends FormProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseForm: FC<BaseFormProps> = ({
    render,
    form,
    onFinish,
    onFinishFailed,
    onValueChange,
    children,
    initialValue,
    ...renderProps
}) => {
    const id = useId();
    const [formStore] = useForm(form);
    const [status, setStatus] = useImmer('idle');
    const {setCallback, setInitialValue} = formStore;

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
        children: <FormContext.Provider value={formStore}>{children}</FormContext.Provider>,
        id,
    });
};
