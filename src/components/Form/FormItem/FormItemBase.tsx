import {RuleItem} from 'async-validator';
import {FC, useCallback, useEffect, useId, useMemo} from 'react';
import {useImmer} from 'use-immer';
import {UTIL} from '../../../utils/util';
import {useFormContext} from '../useFormContext';
import {FormItemProps} from './FormItem';

export type RenderProps = FormItemProps;
export interface FormItemBaseProps extends FormItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const initialState = {};

export const FormItemBase: FC<FormItemBaseProps> = props => {
    const {
        labelText,
        name,
        render,
        renderControl,
        rules,
        validateFirst,
        ...renderProps
    } = props;

    const [, setState] = useImmer(initialState);
    const {getFieldError, getFieldValue, setFieldValue, signInField} =
        useFormContext();

    const errors = getFieldError(name)?.errors;
    const fieldValue = name ? getFieldValue(name) : name;
    const id = useId();

    const onValueChange = useCallback(
        (value?: unknown) => {
            if (name) {
                setFieldValue({[name]: value});
            }
        },
        [name, setFieldValue],
    );

    const processValidate = useCallback(
        (validateRules?: RuleItem[]) => async (value: unknown) => {
            const isValidate = name && validateRules?.length !== 0;

            if (isValidate) {
                return UTIL.validate({
                    name,
                    rules: validateRules,
                    validateFirst,
                    value,
                });
            }
        },
        [name, validateFirst],
    );

    const children = useMemo(
        () =>
            renderControl?.({
                errorMessage: errors?.[0].message,
                errors,
                id,
                labelText,
                onValueChange: onValueChange,
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
            validate: processValidate(rules),
        });
    }, [name, processValidate, rules, setState, signInField, validateFirst]);

    return render({
        ...renderProps,
        children,
        id,
    });
};
