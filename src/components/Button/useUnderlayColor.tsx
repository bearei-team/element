import {useTheme} from 'styled-components/native';
import {Type} from './Button';

export interface UseUnderlayColorOptions {
    type: Type;
}

export const useUnderlayColor = ({type}: UseUnderlayColorOptions) => {
    const {palette} = useTheme();
    const underlay = {
        elevated: palette.primary.primary,
        filled: palette.primary.onPrimary,
        outlined: palette.primary.primary,
        text: palette.primary.primary,
        tonal: palette.secondary.onSecondaryContainer,
    };

    return [underlay[type]];
};
