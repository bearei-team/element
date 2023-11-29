import {FC, useId} from 'react';
import {IconProps} from './Icon';
import {icon} from './icons/icon';

export interface RenderProps extends IconProps {
    renderStyle: {
        height?: number;
        width?: number;
    };
}

export interface IconBaseProps extends IconProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const IconBase: FC<IconBaseProps> = ({
    category = 'image',
    height,
    name = 'lens',
    render,
    type = 'outlined',
    width,
    ...renderProps
}) => {
    const id = useId();
    const SvgIcon = icon?.[type]?.[category]?.[name];

    return render({
        ...renderProps,
        id,
        renderStyle: {height, width},
        children: SvgIcon && (
            <SvgIcon width="100%" height="100%" viewBox="0 0 24 24" testID={`icon__svg--${id}`} />
        ),
    });
};
