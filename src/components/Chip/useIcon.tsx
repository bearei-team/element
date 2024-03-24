import React, {cloneElement} from 'react'
import {useTheme} from 'styled-components/native'
import {IconProps} from '../Icon/Icon'
import {RenderProps} from './ChipBase'

interface UseIconOptions
    extends Pick<RenderProps, 'disabled' | 'type' | 'eventName' | 'fill'> {
    icon?: React.JSX.Element
}

export const useIcon = ({disabled, icon, eventName, fill}: UseIconOptions) => {
    const theme = useTheme()

    if (!icon) {
        return [icon]
    }

    return [
        cloneElement<IconProps>(icon, {
            eventName,
            fill:
                disabled ?
                    theme.color.convertHexToRGBA(
                        theme.palette.surface.onSurface,
                        0.38
                    )
                :   fill ?? theme.palette.primary.primary,
            renderStyle: {
                width: theme.adaptSize(theme.spacing.large - 6),
                height: theme.adaptSize(theme.spacing.large - 6)
            }
        })
    ]
}
