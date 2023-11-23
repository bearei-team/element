import {ValidateError} from 'async-validator';
import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {ValidateOptions} from '../../../utils/validate.utils';
import {Store} from '../formStore';
import {BaseItem, RenderProps} from './BaseItem';
import {Container} from './Item.styles';

export interface ControlProps {
    value: unknown;
    onValueChange?: (value?: unknown) => void;
    errors?: ValidateError[];
    errorMessage?: string;
    id?: string;
    label?: string;
}

export interface ItemProps<T extends Store = Store>
    extends Partial<
        ViewProps &
            RefAttributes<View> &
            Pick<ValidateOptions, 'rules' | 'validateFirst'> &
            Pick<ControlProps, 'label'>
    > {
    name?: keyof T;
    initialValue?: Store;
    renderControl?: (props: ControlProps) => JSX.Element;
}

const ForwardRefItem = forwardRef<View, ItemProps>((props, ref) => {
    const render = ({id, children, ...containerProps}: RenderProps) => (
        <Container {...containerProps} ref={ref} testID={`formItem--${id}`}>
            {children}
        </Container>
    );

    return <BaseItem {...props} render={render} />;
});

export const Item: FC<ItemProps> = memo(ForwardRefItem);
