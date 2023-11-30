import {useTheme} from 'styled-components/native';
import {ButtonType} from './Button';

export interface UseUnderlayColorOptions {
    type: ButtonType;
}

export const useUnderlayColor = (options: UseUnderlayColorOptions) => {
    const {type} = options;
    const theme = useTheme();
    const underlay = {
        elevated: theme.palette.primary.primary,
        filled: theme.palette.primary.onPrimary,
        outlined: theme.palette.primary.primary,
        text: theme.palette.primary.primary,
        tonal: theme.palette.secondary.onSecondaryContainer,
    };

    return [underlay[type]];
};
