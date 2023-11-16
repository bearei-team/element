import {useTheme} from 'styled-components/native';
import {Type} from './TextField';

export interface UseUnderlayColorOptions {
    type: Type;
}

export const useUnderlayColor = ({type}: UseUnderlayColorOptions) => {
    const {palette} = useTheme();
    const underlay = {
        filled: palette.surface.onSurface,
        outlined: palette.surface.onSurface,
    };

    return [underlay[type]];
};
