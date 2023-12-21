import React, {ForwardedRef, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {Container} from './Form.styles';
import {FormBase, RenderProps} from './FormBase';
import {Item, ItemProps} from './Item/Item';
import {Callback, FormStore, Store} from './formStore';
import {useForm} from './useForm';

export type FormComponent = typeof MemoForm & {
    Item: typeof Item;
    useForm: typeof useForm;
};

export interface FormProps<T extends Store = Store>
    extends Partial<ViewProps & RefAttributes<View> & Callback<T>> {
    form?: FormStore<T>;
    initialValue?: T;
    items?: ItemProps[];
    layout?: 'horizontal' | 'vertical';
}

const FormInner = <T extends Store>(
    props: FormProps<T>,
    ref: ForwardedRef<View>,
) => {
    const render = (renderProps: RenderProps<T>) => {
        const {id, children, ...containerProps} = renderProps;

        return (
            <Container {...containerProps} ref={ref} testID={`form--${id}`}>
                {children}
            </Container>
        );
    };

    return <FormBase {...props} render={render} />;
};

const MemoForm = memo(forwardRef(FormInner)) as typeof FormInner;

Object.defineProperty(MemoForm, 'useForm', {value: useForm});

export const Form = MemoForm as FormComponent;
