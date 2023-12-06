import {useTheme} from 'styled-components/native';
import {ButtonType, Category} from './Button';

export interface UseUnderlayColorOptions {
    type: ButtonType;
    category: Category;
}

export const useUnderlayColor = (options: UseUnderlayColorOptions) => {
    const {type, category} = options;
    const theme = useTheme();
    const underlay = {
        elevated: theme.palette.primary.primary,
        filled: theme.palette.primary.onPrimary,
        outlined:
            category === 'button'
                ? theme.palette.primary.primary
                : theme.palette.surface.onSurfaceVariant,
        text:
            category === 'button'
                ? theme.palette.primary.primary
                : theme.palette.surface.onSurfaceVariant,

        tonal: theme.palette.secondary.onSecondaryContainer,
    };

    return [underlay[type]];
};
