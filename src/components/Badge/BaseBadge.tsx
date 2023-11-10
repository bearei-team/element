import {FC, useId} from 'react';
import {BadgeProps} from './Badge';

export type RenderProps = BadgeProps;
export interface BaseDividerProps extends BadgeProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseBadge: FC<BaseDividerProps> = ({
    label = 0,
    render,
    size = 'medium',
    ...renderProps
}) => {
    const id = useId();
    const labelText = Number(label) > 99 ? '99+' : label;

    return render({
        ...renderProps,
        id,
        label: size !== 'small' ? labelText : '',
        size,
    });
};
