import React, {cloneElement} from 'react';
import {useTheme} from 'styled-components/native';
import {RenderProps} from './ChipBase';

export interface UseIconOptions extends Pick<RenderProps, 'disabled' | 'type' | 'eventName'> {
    icon?: React.JSX.Element;
}

export const useIcon = ({disabled, icon, eventName}: UseIconOptions) => {
    const theme = useTheme();

    if (!icon) {
        return [icon];
    }

    return [
        cloneElement(icon, {
            eventName,
            width: theme.adaptSize(theme.spacing.large - 6),
            height: theme.adaptSize(theme.spacing.large - 6),
            fill: disabled
                ? theme.color.convertHexToRGBA(theme.palette.surface.onSurface, 0.38)
                : theme.palette.primary.primary,
        }),
    ];
};
