import {useTheme} from 'styled-components/native';
import {RenderProps} from './IconButtonBase';

export type UseUnderlayColorOptions = Required<Pick<RenderProps, 'type'>>;

export const useUnderlayColor = (options: UseUnderlayColorOptions) => {
    const {type} = options;
    const theme = useTheme();
    const underlay = {
        filled: theme.palette.primary.onPrimary,
        outlined: theme.palette.surface.onSurfaceVariant,
        standard: theme.palette.surface.onSurfaceVariant,
        tonal: theme.palette.secondary.onSecondaryContainer,
    };

    return [underlay[type]];
};
