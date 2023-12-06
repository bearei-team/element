import {FC, useId} from 'react';
import {ListProps} from './List';

export type RenderProps = ListProps;
export interface ListBaseProps extends ListProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const ListBase: FC<ListBaseProps> = props => {
    const {labelText = 0, render, size = 'medium', ...renderProps} = props;
    const id = useId();
    const text = Number(labelText) > 999 ? '999+' : labelText;

    return render({
        ...renderProps,
        id,
        labelText: size !== 'small' ? text : '',
        size,
    });
};
