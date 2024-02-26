import React, {ForwardedRef, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {Container} from './Form.styles';
import {FormBase, FormProps, RenderProps} from './FormBase';
import {FormStore, Store} from './formStore';
import {useForm} from './useForm';
import {FormContext} from './useFormContext';

type FormComponent = typeof MemoForm & {
    useForm: typeof useForm;
};

const render = <T extends Store>({id, children, form, ...containerProps}: RenderProps<T>) => (
    <Container {...containerProps} testID={`form--${id}`}>
        <FormContext.Provider value={form as FormStore<Store>}>{children}</FormContext.Provider>
    </Container>
);

const FormInner = <T extends Store>(props: FormProps<T>, ref: ForwardedRef<View>) => (
    <FormBase {...props} ref={ref} render={render} />
);

const MemoForm = memo(forwardRef(FormInner)) as typeof FormInner;

Object.defineProperty(MemoForm, 'useForm', {value: useForm});

export const Form = MemoForm as FormComponent;
export type {FormProps};
