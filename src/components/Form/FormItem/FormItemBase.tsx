import {RuleItem} from 'async-validator';
import {FC, useCallback, useEffect, useId, useMemo} from 'react';
import {useImmer} from 'use-immer';
import {UTIL} from '../../../utils/util';
import {ComponentStatus} from '../../Common/interface';
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

const processValueChange = (value: unknown, {name, setFieldValue}: ProcessValueChangeOptions) => {
    if (name) {
        setFieldValue({[name]: value});
    }
};

const processValidate = async (
    value: unknown,
    {rules, validateFirst, name}: ProcessValidateOptions,
) => {
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

const initialState = {status: 'idle' as ComponentStatus, shouldUpdate: {}};
export const FormItemBase: FC<FormItemBaseProps> = ({
    labelText,
    name,
    render,
    renderControl,
    rules,
    validateFirst,
    ...renderProps
}) => {
    const [{status}, setState] = useImmer(initialState);
    const {
        getFieldError,
        getFieldValue,
        setFieldValue,
        signInField,
        getInitialValue,
        isFieldTouched,
    } = useFormContext();

    const errors = getFieldError(name)?.errors;
    const value = getFieldValue(name);
    const initValue = getInitialValue(name);
    const touched = isFieldTouched(name);
    const touchedValue = touched ? value : initValue;
    const fieldValue = status === 'idle' ? initValue ?? value : touchedValue;
    const id = useId();
    const onValueChange = useCallback(
        (nextValue: unknown) => processValueChange(nextValue, {name, setFieldValue}),
        [name, setFieldValue],
    );

    const validate = useCallback(
        (nextValue: unknown) => processValidate(nextValue, {name, rules, validateFirst}),
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
                setState(draft => {
                    draft.shouldUpdate = {};
                });
            },
            props: {name, rules, validateFirst},
            touched: false,
            validate,
        });

        setState(draft => {
            draft.status = 'succeeded';
        });
    }, [name, rules, setState, signInField, validate, validateFirst]);

    return render({
        ...renderProps,
        children,
        id,
    });
};
