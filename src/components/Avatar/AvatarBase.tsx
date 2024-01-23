import {FC, useId} from 'react';
import {AvatarProps} from './Avatar';

export type RenderProps = AvatarProps;
export interface AvatarBaseProps extends AvatarProps {
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
