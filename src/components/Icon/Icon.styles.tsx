import styled, {css} from 'styled-components/native'
import {PlatformInlineView} from '../Common/Common.styles'
import {IconProps} from './Icon'

type ContainerProps = Pick<IconProps, 'renderStyle'>

export const Container = styled(PlatformInlineView)<ContainerProps>`
    ${({renderStyle = {}, theme}) => {
        const {height, width} = renderStyle

        return css`
            height: ${height ?? theme.adaptSize(theme.spacing.large)}px;
            max-height: ${theme.adaptSize(theme.spacing.small * 6)}px;
            max-width: ${theme.adaptSize(theme.spacing.small * 6)}px;
            width: ${width ?? theme.adaptSize(theme.spacing.large)}px;
        `
    }}
`
