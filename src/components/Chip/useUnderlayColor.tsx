import {useTheme} from 'styled-components/native';
import {RenderProps} from './ChipBase';

type UseUnderlayColorOptions = Required<Pick<RenderProps, 'type' | 'elevated'>>;

export const useUnderlayColor = ({type, elevated}: UseUnderlayColorOptions) => {
    const theme = useTheme();
    const underlay = {
        input: theme.palette.surface.onSurfaceVariant,
        assist: elevated
            ? theme.palette.surface.surfaceContainerLow
            : theme.palette.surface.onSurfaceVariant,
        filter: elevated
            ? theme.palette.surface.surfaceContainerLow
            : theme.palette.surface.onSurfaceVariant,
        suggestion: elevated
            ? theme.palette.surface.surfaceContainerLow
            : theme.palette.surface.onSurfaceVariant,
        text: elevated
            ? theme.palette.surface.surfaceContainerLow
            : theme.palette.surface.onSurfaceVariant,
    };

    return [underlay[type]];
};
