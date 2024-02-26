import React, {cloneElement} from 'react';
import {useTheme} from 'styled-components/native';
import {Icon, IconProps} from '../Icon/Icon';
import {RenderProps} from './IconButtonBase';

interface UseIconOptions extends Pick<RenderProps, 'disabled' | 'type' | 'eventName' | 'fill'> {
    icon?: React.JSX.Element;
}

export const useIcon = ({disabled, icon, type, eventName, fill}: UseIconOptions) => {
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
                width: theme.adaptSize(theme.spacing.large),
                height: theme.adaptSize(theme.spacing.large),
            },
            fill: disabled
                ? theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 0.38)
                : fill ?? fillType[type as keyof typeof fillType],
        }),
    ];
};
