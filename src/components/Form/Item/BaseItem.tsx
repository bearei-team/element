import {RuleItem} from 'async-validator';
import {FC, useCallback, useEffect, useId} from 'react';
import {UTIL} from '../../../utils/util';
import {useFormContext} from '../useFormContext';
import {ItemProps} from './Item';

export type RenderProps = ItemProps;
export interface BaseItemProps extends ItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseItem: FC<BaseItemProps> = ({
    render,
    name,
    rules,
    validateFirst,
    ...renderProps
}) => {
    const id = useId();
    const {signInField, getFieldValue, setFieldsValue, getFieldError} = useFormContext();

    const processValidate = useCallback(
        (rules?: RuleItem[]) => async () => {
            const isValidate = name && rules?.length !== 0;

            if (isValidate) {
                const value = getFieldValue(name);

                return UTIL.validate({
                    name,
                    rules,
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
        });
    }, [name, processValidate, rules, signInField, validateFirst]);

    return render({
        ...renderProps,
        id,
    });
};
