import {useTheme} from 'styled-components/native';
import {RenderProps} from './CardBase';

type UseUnderlayColorOptions = Pick<RenderProps, 'type'>;

export const useUnderlayColor = ({type = 'filled'}: UseUnderlayColorOptions) => {
    const theme = useTheme();
    const underlay = {
        elevated: theme.palette.surface.onSurface,
        filled: theme.palette.surface.onSurface,
        outlined: theme.palette.surface.onSurface,
    };

    return [underlay[type]];
};
