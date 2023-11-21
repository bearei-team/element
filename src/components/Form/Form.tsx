import React, {RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {BaseForm, RenderProps} from './BaseForm';
import {Container} from './Form.styles';
import {Callback, Store} from './formStore';

export interface FormProps<T extends Store = Store>
    extends Partial<ViewProps & RefAttributes<View> & Callback<T>> {
    form?: any;
    layout?: 'horizontal' | 'vertical';
}

const ForwardRefForm = forwardRef<View, FormProps>((props, ref) => {
    const render = ({id, ...containerProps}: RenderProps) => (
        <Container {...containerProps} ref={ref} testID={`form--${id}`}></Container>
    );

    return <BaseForm {...props} render={render} />;
});

export const Form = memo(ForwardRefForm);
