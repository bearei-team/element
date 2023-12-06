import {FC, useId} from 'react';
import {useTheme} from 'styled-components/native';
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

export const IconBase: FC<IconBaseProps> = props => {
    const {
        category = 'image',
        height,
        name = 'circle',
        render,
        type = 'filled',
        width,
        fill,
        ...renderProps
    } = props;

    const id = useId();
    const theme = useTheme();
    const SvgIcon = icon?.[type]?.[category]?.[name];

    return render({
        ...renderProps,
        id,
        renderStyle: {height, width},
        children: SvgIcon && (
            <SvgIcon
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                testID={`icon__svg--${id}`}
                fill={fill ?? theme.palette.surface.onSurfaceVariant}
            />
        ),
    });
};
