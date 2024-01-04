import {useTheme} from 'styled-components/native';
import {RenderProps} from './FABBase';

export type UseUnderlayColorOptions = Required<Pick<RenderProps, 'type'>>;

export const useUnderlayColor = (options: UseUnderlayColorOptions) => {
    const {type} = options;
    const theme = useTheme();
    const underlay = {
        primary: theme.palette.primary.onPrimaryContainer,
        secondary: theme.palette.secondary.onSecondaryContainer,
        surface: theme.palette.primary.primary,
        tertiary: theme.palette.tertiary.onTertiaryContainer,
    };

    return [underlay[type]];
};
