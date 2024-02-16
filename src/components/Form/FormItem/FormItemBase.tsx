import {RuleItem} from 'async-validator';
import {FC, useCallback, useEffect, useId, useMemo} from 'react';
import {Updater, useImmer} from 'use-immer';
import {UTIL} from '../../../utils/util';
import {ComponentStatus} from '../../Common/interface';
import {FieldError, FormStore, Store} from '../formStore';
import {useFormContext} from '../useFormContext';
import {FormItemProps} from './FormItem';

export type RenderProps = FormItemProps;
export interface FormItemBaseProps extends FormItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface InitialState {
    shouldUpdate: {};
    signOut?: () => void;
    status: ComponentStatus;
}

export interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

export interface ProcessValueChangeOptions extends Pick<FormStore<Store>, 'setFieldValue'> {
    name?: string;
}

export interface ProcessValidateOptions {
    name?: string;
    validateFirst?: boolean;
    rules?: RuleItem[];
}

export type ProcessInitOptions = ProcessEventOptions &
    Pick<FormItemBaseProps, 'name' | 'rules' | 'validateFirst'> & {
        validate: (value?: unknown) => Promise<FieldError | undefined>;
    };

const processValueChange = (value: unknown, {name, setFieldValue}: ProcessValueChangeOptions) =>
    name && setFieldValue({[name]: value});

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

const processInit = (
    signInField: FormStore<Store>['signInField'],
    {name, rules, validateFirst, validate, setState}: ProcessInitOptions,
) => {
    const {signOut} =
        signInField({
            onFormStoreChange: () =>
                setState(draft => {
                    draft.shouldUpdate = {};
                }),
            props: {name, rules, validateFirst},
            touched: false,
            validate,
        }) ?? {};

    setState(draft => {
        draft.signOut = signOut;
        draft.status = 'succeeded';
    });
};

export const FormItemBase: FC<FormItemBaseProps> = ({
    labelText,
    name,
    render,
    renderControl,
    rules,
    validateFirst,
    ...renderProps
}) => {
    const [{status, signOut}, setState] = useImmer<InitialState>({
        shouldUpdate: {},
        signOut: undefined,
        status: 'idle',
    });

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
        processInit(signInField, {name, rules, setState, validateFirst, validate});
    }, [name, rules, setState, signInField, validate, validateFirst]);

    useEffect(() => () => signOut?.(), [signOut]);

    return render({
        ...renderProps,
        children,
        id,
    });
};
