import {FC, useId} from 'react';
import {DividerProps} from './Divider';

export interface RenderProps extends DividerProps {}
export interface BaseDividerProps extends DividerProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseDivider: FC<BaseDividerProps> = ({render, ...renderProps}) => {
    const id = useId();
    const divider = render({
        ...renderProps,
        id,
    });

    return divider;
};
