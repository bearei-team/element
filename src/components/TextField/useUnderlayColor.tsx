import {useTheme} from 'styled-components/native';
import {TextFieldType} from './TextField';

export interface UseUnderlayColorOptions {
    type: TextFieldType;
}

export const useUnderlayColor = ({type}: UseUnderlayColorOptions) => {
    const {palette} = useTheme();
    const underlay = {
        filled: palette.surface.onSurface,
        outlined: palette.surface.onSurface,
    };

    return [underlay[type]];
};
