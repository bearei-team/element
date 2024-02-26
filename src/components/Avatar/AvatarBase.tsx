import {FC, RefAttributes, useId} from 'react';
import {View, ViewProps} from 'react-native';

export interface AvatarProps extends Partial<ViewProps & RefAttributes<View>> {
    labelText?: string;
    renderStyle?: {height?: number; width?: number};
}

export type RenderProps = AvatarProps;
interface AvatarBaseProps extends AvatarProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const AvatarBase: FC<AvatarBaseProps> = ({labelText = 'A', render, ...renderProps}) => {
    const id = useId();

    return render({
        ...renderProps,
        id,
        labelText,
    });
};
