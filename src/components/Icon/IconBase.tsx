import {RefAttributes, forwardRef, useId} from 'react';
import {Animated, View, ViewProps, ViewStyle} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {useTheme} from 'styled-components/native';
import {EventName} from '../Common/interface';
import {filled} from './icons/filled';
import {icon} from './icons/icon';
import {useAnimated} from './useAnimated';

type IconName = keyof (typeof filled)['svg'];
type IconType = 'filled' | 'outlined' | 'round' | 'sharp' | 'twoTone';
type BaseProps = Partial<Omit<SvgProps, 'width' | 'height'> & RefAttributes<View> & ViewProps>;
export interface IconProps extends BaseProps {
    eventName?: EventName;
    name?: IconName;
    renderStyle?: {width?: number; height?: number};
    type?: IconType;
}

export interface RenderProps extends IconProps {
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        height?: number;
        width?: number;
    };
}

interface IconBaseProps extends IconProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const IconBase = forwardRef<View, IconBaseProps>(
    (
        {eventName, fill, name = 'circle', render, renderStyle, type = 'outlined', ...renderProps},
        ref,
    ) => {
        const id = useId();
        const SvgIcon = icon?.[type]?.svg?.[name];
        const theme = useTheme();
        const [{scale}] = useAnimated({eventName});

        return render({
            ...renderProps,
            id,
            ref,
            renderStyle: {...renderStyle, transform: [{scale}]},
            children: SvgIcon && (
                <SvgIcon
                    fill={fill ?? theme.palette.surface.onSurfaceVariant}
                    height="100%"
                    viewBox="0 0 24 24"
                    width="100%"
                />
            ),
        });
    },
);
