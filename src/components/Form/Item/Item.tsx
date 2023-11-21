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
}

export interface ItemProps<T extends Store = Store>
    extends Partial<
        ViewProps & RefAttributes<View> & Pick<ValidateOptions, 'rules' | 'validateFirst'>
    > {
    name?: keyof T;
    initialValue?: unknown;
    renderControl?: (props: ControlProps) => JSX.Element;
}

const ForwardRefItem = forwardRef<View, ItemProps>((props, ref) => {
    const render = ({id, ...containerProps}: RenderProps) => (
        <Container {...containerProps} ref={ref} testID={`divider--${id}`}></Container>
    );

    return <BaseItem {...props} render={render} />;
});

export const Item: FC<ItemProps> = memo(ForwardRefItem);
