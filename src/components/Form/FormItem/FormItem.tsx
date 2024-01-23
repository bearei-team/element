import {ValidateError} from 'async-validator';
import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {ValidateOptions} from '../../../utils/validate.utils';
import {Store} from '../formStore';
import {Container} from './FormItem.styles';
import {FormItemBase, RenderProps} from './FormItemBase';

export interface ControlProps {
    errorMessage?: string;
    errors?: ValidateError[];
    id?: string;
    labelText?: string;
    onValueChange?: (value?: unknown) => void;
    value?: unknown;
}

export interface FormItemProps
    extends Partial<
        ViewProps &
            RefAttributes<View> &
            Pick<ValidateOptions, 'rules' | 'validateFirst'> &
            Pick<ControlProps, 'labelText'>
    > {
    initialValue?: Store;
    name?: string;
    renderControl?: (props: ControlProps) => JSX.Element;
}

const render = ({id, children, ...containerProps}: RenderProps) => (
    <Container {...containerProps} testID={`formItem--${id}`}>
        {children}
    </Container>
);

const ForwardRefFormItem = forwardRef<View, FormItemProps>((props, ref) => (
    <FormItemBase {...props} ref={ref} render={render} />
));

export const FormItem: FC<FormItemProps> = memo(ForwardRefFormItem);
