import {FC, useId} from 'react';
import {BadgeProps} from './Badge';

export type RenderProps = BadgeProps;
export interface BadgeBaseProps extends BadgeProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BadgeBase: FC<BadgeBaseProps> = ({
    labelText = 0,
    render,
    size = 'medium',
    ...renderProps
}) => {
    const id = useId();
    const labelContentText = Number(labelText) > 999 ? '999+' : labelText;

    return render({
        ...renderProps,
        id,
        labelText: size !== 'small' ? labelContentText : '',
        size,
    });
};
