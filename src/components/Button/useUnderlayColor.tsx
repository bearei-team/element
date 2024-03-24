import {useTheme} from 'styled-components/native'
import {RenderProps} from './ButtonBase'

type UseUnderlayColorOptions = Pick<RenderProps, 'type'>

export const useUnderlayColor = ({
    type = 'filled'
}: UseUnderlayColorOptions) => {
    const theme = useTheme()
    const underlay = {
        elevated: theme.palette.primary.primary,
        filled: theme.palette.primary.onPrimary,
        link: theme.palette.primary.primary,
        outlined: theme.palette.primary.primary,
        text: theme.palette.primary.primary,
        tonal: theme.palette.secondary.onSecondaryContainer
    }

    return [underlay[type]]
}
