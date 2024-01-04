import React, {cloneElement} from 'react';
import {useTheme} from 'styled-components/native';
import {RenderProps} from './ButtonBase';

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
        tonal: theme.palette.surface.onSurfaceVariant,
    };

    if (!icon) {
        return {icon};
    }

    return {
        icon: cloneElement(icon, {
            eventName,
            fill: disabled
                ? theme.color.rgba(theme.palette.surface.onSurface, 0.38)
                : fillType[type as keyof typeof fillType],
        }),
    };
};
