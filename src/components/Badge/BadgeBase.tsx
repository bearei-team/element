import {FC, RefAttributes, useId} from 'react';
import {View, ViewProps} from 'react-native';
import {Size} from '../Common/interface';

export interface BadgeProps extends Partial<ViewProps & RefAttributes<View>> {
    labelText?: number | string;
    renderStyle?: {bottom?: number; left?: number; right?: number; top?: number};
    size?: Size;
}

export type RenderProps = BadgeProps;
interface BadgeBaseProps extends BadgeProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BadgeBase: FC<BadgeBaseProps> = ({
    labelText = 0,
    render,
    size = 'medium',
    ...renderProps
}) => {
    const id = useId();

    return render({
        ...renderProps,
        id,
        labelText: Number(labelText) > 999 ? '999+' : labelText,
        size,
    });
};
