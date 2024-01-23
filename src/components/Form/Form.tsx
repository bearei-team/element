import React, {ForwardedRef, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {Container} from './Form.styles';
import {FormBase, RenderProps} from './FormBase';
import {FormItemProps} from './FormItem/FormItem';
import {Callback, FormStore, Store} from './formStore';
import {useForm} from './useForm';

export type FormComponent = typeof MemoForm & {
    useForm: typeof useForm;
};

/**
 * TODO: vertical
 */
export interface FormProps<T extends Store = Store>
    extends Partial<ViewProps & RefAttributes<View> & Callback<T>> {
    form?: FormStore<T>;
    initialValue?: T;
    items?: FormItemProps[];
    layout?: 'horizontal' | 'vertical';
}

const render = <T extends Store>({id, children, ...containerProps}: RenderProps<T>) => (
    <Container {...containerProps} testID={`form--${id}`}>
        {children}
    </Container>
);

const FormInner = <T extends Store>(props: FormProps<T>, ref: ForwardedRef<View>) => (
    <FormBase {...props} ref={ref} render={render} />
);

const MemoForm = memo(forwardRef(FormInner)) as typeof FormInner;

Object.defineProperty(MemoForm, 'useForm', {value: useForm});

export const Form = MemoForm as FormComponent;
