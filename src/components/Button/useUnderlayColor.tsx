import {useTheme} from 'styled-components/native';
import {RenderProps} from './ButtonBase';

export type UseUnderlayColorOptions = Required<Pick<RenderProps, 'type'>>;

export const useUnderlayColor = (options: UseUnderlayColorOptions) => {
    const {type} = options;
    const theme = useTheme();
    const underlay = {
        elevated: theme.palette.primary.primary,
        filled: theme.palette.primary.onPrimary,
        outlined: theme.palette.primary.primary,
        text: theme.palette.primary.primary,
        link: theme.palette.primary.primary,
        tonal: theme.palette.secondary.onSecondaryContainer,
    };

    return [underlay[type]];
};
