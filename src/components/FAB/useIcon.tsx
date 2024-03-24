import React, {cloneElement} from 'react'
import {useTheme} from 'styled-components/native'
import {IconProps} from '../Icon/Icon'
import {RenderProps} from './FABBase'

interface UseIconOptions
    extends Pick<RenderProps, 'size' | 'disabled' | 'type' | 'eventName'> {
    icon?: React.JSX.Element
}

export const useIcon = ({
    disabled,
    icon,
    type,
    eventName,
    size
}: UseIconOptions) => {
    const theme = useTheme()
    const fillType = {
        primary: theme.palette.primary.onPrimaryContainer,
        secondary: theme.palette.secondary.onSecondaryContainer,
        surface: theme.palette.primary.primary,
        tertiary: theme.palette.tertiary.onTertiaryContainer
    }

    if (!icon) {
        return [icon]
    }

    return [
        cloneElement<IconProps>(icon, {
            ...(size === 'large' ?
                {
                    width: theme.adaptSize(
                        theme.spacing.extraLarge + theme.spacing.extraSmall
                    ),
                    height: theme.adaptSize(
                        theme.spacing.extraLarge + theme.spacing.extraSmall
                    )
                }
            :   {
                    width: theme.adaptSize(theme.spacing.large),
                    height: theme.adaptSize(theme.spacing.large)
                }),
            eventName,
            fill:
                disabled ?
                    theme.color.convertHexToRGBA(
                        theme.palette.surface.onSurface,
                        0.38
                    )
                :   fillType[type as keyof typeof fillType]
        })
    ]
}
