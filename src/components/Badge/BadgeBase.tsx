import {FC, useId} from 'react';
import {BadgeProps} from './Badge';

export type RenderProps = BadgeProps;
export interface BadgeBaseProps extends BadgeProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BadgeBase: FC<BadgeBaseProps> = ({
    contentText = 0,
    render,
    size = 'medium',
    ...renderProps
}) => {
    const id = useId();
    const labelText = Number(contentText) > 999 ? '999+' : contentText;

    return render({
        ...renderProps,
        id,
        contentText: size !== 'small' ? labelText : '',
        size,
    });
};
