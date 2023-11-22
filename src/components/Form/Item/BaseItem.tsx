import {RuleItem} from 'async-validator';
import {FC, useCallback, useEffect, useId} from 'react';
import {useImmer} from 'use-immer';
import {UTIL} from '../../../utils/util';
import {useFormContext} from '../useFormContext';
import {ControlProps, ItemProps} from './Item';

export interface RenderProps extends ItemProps {
    controlProps: ControlProps;
}
export interface BaseItemProps extends ItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseItem: FC<BaseItemProps> = ({
    name,
    render,
    rules,
    validateFirst,
    ...renderProps
}) => {
    const [, forceUpdate] = useImmer({});
    const {getFieldError, getFieldValue, setFieldValue, signInField} = useFormContext();
    const errors = getFieldError(name)?.errors;
    const errorMessage = errors?.[0].message;
    const id = useId();

    const processValidate = useCallback(
        (validateRules?: RuleItem[]) => async () => {
            const isValidate = name && validateRules?.length !== 0;

            if (isValidate) {
                const value = getFieldValue(name);

                return UTIL.validate({
                    name,
                    rules: validateRules,
                    validateFirst,
                    value,
                });
            }

            return undefined;
        },
        [getFieldValue, name, validateFirst],
    );

    useEffect(() => {
        signInField({
            props: {name, rules, validateFirst},
            touched: false,
            validate: processValidate(rules),
            onStoreChange: () => forceUpdate(() => {}),
        });
    }, [forceUpdate, name, processValidate, rules, signInField, validateFirst]);

    return render({
        ...renderProps,
        id,
        controlProps: {
            value: name ? getFieldValue(name) : name,
            onValueChange: (value?: unknown) => {
                if (name) {
                    setFieldValue({[name]: value});
                }
            },
            errorMessage,
        },
    });
};
