import {useTheme} from 'styled-components/native';
import {RenderProps} from './FABBase';

type UseUnderlayColorOptions = Pick<RenderProps, 'type'>;

export const useUnderlayColor = ({type = 'primary'}: UseUnderlayColorOptions) => {
    const theme = useTheme();
    const underlay = {
        primary: theme.palette.primary.onPrimaryContainer,
        secondary: theme.palette.secondary.onSecondaryContainer,
        surface: theme.palette.primary.primary,
        tertiary: theme.palette.tertiary.onTertiaryContainer,
    };

    return [underlay[type]];
};
