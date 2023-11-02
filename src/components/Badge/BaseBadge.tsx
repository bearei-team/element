import {FC, useId} from 'react';
import {BadgeProps} from './Badge';

export interface RenderProps extends BadgeProps {}
export interface BaseDividerProps extends BadgeProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseBadge: FC<BaseDividerProps> = ({render, label = 0, ...renderProps}) => {
    const id = useId();
    const badge = render({
        ...renderProps,
        label: renderProps.size !== 'small' ? (Number(label) > 99 ? '99+' : label) : '',
        id,
    });

    return badge;
};
