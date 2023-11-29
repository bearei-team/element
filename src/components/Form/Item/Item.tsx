import {ValidateError} from 'async-validator';
import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {ValidateOptions} from '../../../utils/validate.utils';
import {Store} from '../formStore';
import {Container} from './Item.styles';
import {ItemBase, RenderProps} from './ItemBase';

export interface ControlProps {
    value: unknown;
    onValueChange?: (value?: unknown) => void;
    errors?: ValidateError[];
    errorMessage?: string;
    id?: string;
    labelText?: string;
}

export interface ItemProps<T extends Store = Store>
    extends Partial<
        ViewProps &
            RefAttributes<View> &
            Pick<ValidateOptions, 'rules' | 'validateFirst'> &
            Pick<ControlProps, 'labelText'>
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

    return <ItemBase {...props} render={render} />;
});

export const Item: FC<ItemProps> = memo(ForwardRefItem);
