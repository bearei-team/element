import {FC, useId} from 'react';
import {Animated, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useHandleEvent} from '../../hooks/useHandleEvent';
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
        state: eventState,
        type = 'filled',
        width,
        ...renderProps
    } = props;

    const id = useId();
    const theme = useTheme();
    const {state, ...handleEvent} = useHandleEvent({...props, eventState});
    const {scale} = useAnimated({state});
    const SvgIcon = icon?.[type]?.[category]?.[name];

    return render({
        ...handleEvent,
        ...renderProps,
        id,
        renderStyle: {
            height,
            width,
            transform: [{scale}],
        },
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
