import {RuleItem} from 'async-validator';
import {FC, useEffect, useId, useMemo} from 'react';
import {useImmer} from 'use-immer';
import {UTIL} from '../../../utils/util';
import {FormStore} from '../formStore';
import {useFormContext} from '../useFormContext';
import {FormItemProps} from './FormItem';

export type RenderProps = FormItemProps;
export interface FormItemBaseProps extends FormItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface ProcessValueChangeOptions extends Pick<FormStore<any>, 'setFieldValue'> {
    name?: string;
}

export interface ProcessValidateOptions {
    name?: string;
    validateFirst?: boolean;
    rules?: RuleItem[];
}

const processValueChange =
    ({name, setFieldValue}: ProcessValueChangeOptions) =>
    (value?: unknown) => {
        if (name) {
            setFieldValue({[name]: value});
        }
    };

const processValidate =
    ({rules, validateFirst, name}: ProcessValidateOptions) =>
    async (value: unknown) => {
        const isValidate = name && rules?.length !== 0;

        if (isValidate) {
            return UTIL.validate({
                name,
                rules,
                validateFirst,
                value,
            });
        }
    };

const initialState = {};
export const FormItemBase: FC<FormItemBaseProps> = ({
    labelText,
    name,
    render,
    renderControl,
    rules,
    validateFirst,
    ...renderProps
}) => {
    const [, setState] = useImmer(initialState);
    const {getFieldError, getFieldValue, setFieldValue, signInField} = useFormContext();
    const errors = getFieldError(name)?.errors;
    const fieldValue = name ? getFieldValue(name) : name;
    const id = useId();

    const onValueChange = useMemo(
        () => processValueChange({name, setFieldValue}),
        [name, setFieldValue],
    );

    const validate = useMemo(
        () => processValidate({name, rules, validateFirst}),
        [name, rules, validateFirst],
    );

    const children = useMemo(
        () =>
            renderControl?.({
                errorMessage: errors?.[0].message,
                errors,
                id,
                labelText,
                onValueChange,
                value: fieldValue,
            }),
        [errors, fieldValue, id, labelText, onValueChange, renderControl],
    );

    useEffect(() => {
        signInField({
            onFormStoreChange: () => {
                setState({});
            },
            props: {name, rules, validateFirst},
            touched: false,
            validate,
        });
    }, [name, rules, setState, signInField, validate, validateFirst]);

    return render({
        ...renderProps,
        children,
        id,
    });
};
