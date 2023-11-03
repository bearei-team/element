import {FC, useId} from 'react';
import {DividerProps} from './Divider';

export type RenderProps = DividerProps;
export interface BaseDividerProps extends DividerProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseDivider: FC<BaseDividerProps> = ({
    render,
    size,
    subheader,
    layout,
    ...renderProps
}) => {
    const id = useId();

    return render({
        ...renderProps,
        layout,
        size: subheader && layout === 'horizontal' ? 'small' : size,
        subheader,
        id,
    });
};
