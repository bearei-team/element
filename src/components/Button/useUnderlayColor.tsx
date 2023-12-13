import {useTheme} from 'styled-components/native';
import {RenderProps} from './ButtonBase';

export type UseUnderlayColorOptions = Required<Pick<RenderProps, 'type' | 'fabType' | 'category'>>;

export const useUnderlayColor = (options: UseUnderlayColorOptions) => {
    const {type, category, fabType} = options;
    const theme = useTheme();
    const commonUnderlay = {
        elevated: theme.palette.primary.primary,
        filled: theme.palette.primary.onPrimary,
        outlined:
            category === 'common'
                ? theme.palette.primary.primary
                : theme.palette.surface.onSurfaceVariant,
        text:
            category === 'common'
                ? theme.palette.primary.primary
                : theme.palette.surface.onSurfaceVariant,

        tonal: theme.palette.secondary.onSecondaryContainer,
    };

    const fabUnderlay = {
        primary: theme.palette.primary.onPrimaryContainer,
        secondary: theme.palette.secondary.onSecondaryContainer,
        surface: theme.palette.primary.primary,
        tertiary: theme.palette.tertiary.onTertiaryContainer,
    };

    return [category === 'fab' ? fabUnderlay[fabType] : commonUnderlay[type]];
};
