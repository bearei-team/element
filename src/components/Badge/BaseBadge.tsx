import {FC, useId} from 'react';
import {BadgeProps} from './Badge';

export type RenderProps = BadgeProps;
export interface BaseDividerProps extends BadgeProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseBadge: FC<BaseDividerProps> = ({
    render,
    label = 0,
    size = 'medium',
    ...renderProps
}) => {
    const id = useId();

    return render({
        ...renderProps,
        size,
        label: size !== 'small' ? (Number(label) > 99 ? '99+' : label) : '',
        id,
    });
};
