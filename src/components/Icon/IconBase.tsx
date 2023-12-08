import {FC, useId} from 'react';
import {Animated, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {IconProps} from './Icon';
import {icon} from './icons/icon';
import {useAnimated} from './useAnimated';

export interface RenderProps extends IconProps {
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
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
        fill,
        height,
        name = 'circle',
        render,
        state = 'enabled',
        type = 'outlined',
        width,
        ...renderProps
    } = props;

    const {scale} = useAnimated({state});
    const id = useId();
    const SvgIcon = icon?.[type]?.[category]?.[name];
    const theme = useTheme();

    return render({
        ...renderProps,
        id,
        renderStyle: {
            height,
            transform: [{scale}],
            width,
        },
        children: SvgIcon && (
            <SvgIcon
                fill={fill ?? theme.palette.surface.onSurfaceVariant}
                height="100%"
                testID={`icon__svg--${id}`}
                viewBox="0 0 24 24"
                width="100%"
            />
        ),
    });
};
