import {RefAttributes, forwardRef, useId} from 'react';
import {View, ViewProps} from 'react-native';

export interface AvatarProps extends Partial<ViewProps & RefAttributes<View>> {
    labelText?: string;
    renderStyle?: {height?: number; width?: number};
}

export type RenderProps = AvatarProps;
interface AvatarBaseProps extends AvatarProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const AvatarBase = forwardRef<View, AvatarBaseProps>(
    ({labelText = 'A', render, ...renderProps}, ref) => {
        const id = useId();

        return render({
            ...renderProps,
            id,
            labelText,
            ref,
        });
    },
);
