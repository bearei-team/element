import {FC, useId} from 'react';
import {AvatarProps} from './Avatar';

export type RenderProps = AvatarProps;
export interface AvatarBaseProps extends AvatarProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const AvatarBase: FC<AvatarBaseProps> = props => {
    const {labelText = 'A', render, ...renderProps} = props;
    const id = useId();

    return render({
        ...renderProps,
        id,
        labelText,
    });
};
