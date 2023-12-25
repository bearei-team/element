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

    const [, forceUpdate] = useImmer({});
    const {getFieldError, getFieldValue, setFieldValue, signInField} =
        useFormContext();

    const errors = getFieldError(name)?.errors;
    const errorMessage = errors?.[0].message;
    const id = useId();

    const onValueChange = useCallback(
        (value?: unknown) => {
            name && setFieldValue({[name]: value});
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
                errorMessage,
                errors,
                id,
                labelText,
                onValueChange: onValueChange,
                value: name ? getFieldValue(name) : name,
            }),
        [
            errorMessage,
            errors,
            getFieldValue,
            id,
            labelText,
            name,
            onValueChange,
            renderControl,
        ],
    );

    useEffect(() => {
        signInField({
            onStoreChange: () => forceUpdate({}),
            props: {name, rules, validateFirst},
            touched: false,
            validate: processValidate(rules),
        });
    }, [forceUpdate, name, processValidate, rules, signInField, validateFirst]);

    return render({
        ...renderProps,
        children,
        id,
    });
};
