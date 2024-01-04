import React, {cloneElement} from 'react';
import {useTheme} from 'styled-components/native';
import {RenderProps} from './FABBase';

export interface UseIconOptions
    extends Required<Pick<RenderProps, 'disabled' | 'type' | 'eventName'>> {
    icon?: React.JSX.Element;
}

export const useIcon = (options: UseIconOptions) => {
    const {disabled, icon, type, eventName} = options;
    const theme = useTheme();
    const fillType = {
        surface: theme.palette.primary.primary,
        primary: theme.palette.primary.onPrimaryContainer,
        secondary: theme.palette.secondary.onSecondaryContainer,
        tertiary: theme.palette.tertiary.onTertiaryContainer,
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
