import {FC, useEffect, useId} from 'react';
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
    ...renderProps
}) => {
    const id = useId();
    const [formInstance] = useForm(form);
    const {setCallback, setInitialValue} = formInstance;

    useEffect(() => {
        setCallback({onFinish, onFinishFailed, onValueChange});
    }, [onFinish, onFinishFailed, onValueChange, setCallback]);

    return render({
        ...renderProps,
        children: <FormContext.Provider value={formInstance}>{children}</FormContext.Provider>,
        id,
    });
};
