import {FC, useId} from 'react';
import {DividerProps} from './Divider';

export type RenderProps = DividerProps;
export interface DividerBaseProps extends DividerProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const DividerBase: FC<DividerBaseProps> = props => {
    const {layout, render, size, subheader, ...renderProps} = props;
    const id = useId();

    return render({
        ...renderProps,
        id,
        layout,
        size: subheader && layout === 'horizontal' ? 'small' : size,
        subheader,
    });
};
