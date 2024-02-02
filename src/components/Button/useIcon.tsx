import React, {cloneElement} from 'react';
import {useTheme} from 'styled-components/native';
import {RenderProps} from './ButtonBase';

export interface UseIconOptions extends Pick<RenderProps, 'disabled' | 'type' | 'eventName'> {
    icon?: React.JSX.Element;
}

export const useIcon = ({disabled, icon, type, eventName}: UseIconOptions) => {
    const theme = useTheme();
    const fillType = {
        elevated: theme.palette.primary.primary,
        filled: theme.palette.primary.onPrimary,
        outlined: theme.palette.primary.primary,
        text: theme.palette.primary.primary,
        tonal: theme.palette.secondary.onSecondaryContainer,
    };

    if (!icon) {
        return [icon];
    }

    return [
        cloneElement(icon, {
            eventName,
            width: theme.adaptSize(theme.spacing.large - 6),
            height: theme.adaptSize(theme.spacing.large - 6),
            fill: disabled
                ? theme.color.rgba(theme.palette.surface.onSurface, 0.38)
                : fillType[type as keyof typeof fillType],
        }),
    ];
};
