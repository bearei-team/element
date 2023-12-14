import {cloneElement} from 'react';
import {useTheme} from 'styled-components/native';
import {Icon} from '../Icon/Icon';
import {RenderProps} from './ButtonBase';

export type UseIconOptions = Required<
    Pick<RenderProps, 'disabled' | 'type' | 'fabType' | 'category' | 'state'>
> &
    Pick<RenderProps, 'icon'>;

export const useIcon = (options: UseIconOptions) => {
    const {disabled, icon, type, fabType, category, state} = options;
    const theme = useTheme();
    const commonFillType = {
        filled: theme.palette.primary.onPrimary,
        outlined: theme.palette.surface.onSurfaceVariant,
        tonal: theme.palette.surface.onSurfaceVariant,
    };

    const fabFillType = {
        primary: theme.palette.primary.onPrimaryContainer,
        secondary: theme.palette.secondary.onSecondaryContainer,
        surface: theme.palette.primary.primary,
        tertiary: theme.palette.tertiary.onTertiaryContainer,
    };

    const fill =
        category === 'fab'
            ? fabFillType[fabType]
            : commonFillType[type as keyof typeof commonFillType];

    const defaultIcon = icon ?? (category === 'fab' ? <Icon /> : icon);

    if (category === 'common' || !defaultIcon) {
        return icon;
    }

    return cloneElement(defaultIcon, {
        state,
        fill: disabled ? theme.color.rgba(theme.palette.surface.onSurface, 0.38) : fill,
    });
};
