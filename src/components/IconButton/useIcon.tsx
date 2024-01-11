import React, {cloneElement} from 'react';
import {useTheme} from 'styled-components/native';
import {Icon} from '../Icon/Icon';
import {RenderProps} from './IconButtonBase';

export interface UseIconOptions
    extends Required<Pick<RenderProps, 'disabled' | 'type' | 'eventName'>> {
    icon?: React.JSX.Element;
}

export const useIcon = (options: UseIconOptions) => {
    const {disabled, icon, type, eventName} = options;
    const theme = useTheme();
    const fillType = {
        filled: theme.palette.primary.onPrimary,
        outlined: theme.palette.surface.onSurfaceVariant,
        standard: theme.palette.surface.onSurfaceVariant,
        tonal: theme.palette.secondary.onSecondaryContainer,
    };

    return [
        cloneElement(icon ?? <Icon />, {
            eventName,
            fill: disabled
                ? theme.color.rgba(theme.palette.surface.onSurface, 0.38)
                : fillType[type as keyof typeof fillType],
        }),
    ];
};
