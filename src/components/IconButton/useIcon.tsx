import React, {cloneElement} from 'react';
import {LayoutRectangle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Icon, IconProps} from '../Icon/Icon';
import {RenderProps} from './IconButtonBase';

interface UseIconOptions extends Pick<RenderProps, 'disabled' | 'type' | 'eventName' | 'fill'> {
    icon?: React.JSX.Element;
    layout: LayoutRectangle;
}

export const useIcon = ({disabled, icon, type, eventName, fill, layout}: UseIconOptions) => {
    const theme = useTheme();
    const fillType = {
        filled: theme.palette.primary.onPrimary,
        outlined: theme.palette.surface.onSurfaceVariant,
        standard: theme.palette.surface.onSurfaceVariant,
        tonal: theme.palette.secondary.onSecondaryContainer,
    };

    return [
        cloneElement<IconProps>(icon ?? <Icon />, {
            eventName,
            renderStyle: {
                width:
                    typeof layout.width === 'number'
                        ? layout.width / 1.6666
                        : theme.adaptSize(theme.spacing.large),
                height:
                    typeof layout.height === 'number'
                        ? layout.height / 1.6666
                        : theme.adaptSize(theme.spacing.large),
            },
            fill: disabled
                ? theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 0.38)
                : fill ?? fillType[type as keyof typeof fillType],
        }),
    ];
};
