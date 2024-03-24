import {useTheme} from 'styled-components/native'
import {RenderProps} from './IconButtonBase'

type UseUnderlayColorOptions = Pick<RenderProps, 'type'>

export const useUnderlayColor = ({
    type = 'filled'
}: UseUnderlayColorOptions) => {
    const theme = useTheme()
    const underlay = {
        filled: theme.palette.primary.onPrimary,
        outlined: theme.palette.surface.onSurfaceVariant,
        standard: theme.palette.surface.onSurfaceVariant,
        tonal: theme.palette.secondary.onSecondaryContainer
    }

    return [underlay[type]]
}
