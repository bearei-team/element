import styled, {css} from 'styled-components/native'

export const Container = styled.View`
    overflow: hidden;
    position: absolute;
    z-index: 8192;

    ${({theme}) => css`
        bottom: ${theme.adaptSize(theme.spacing.none)}px;
        left: ${theme.adaptSize(theme.spacing.none)}px;
        right: ${theme.adaptSize(theme.spacing.none)}px;
        top: ${theme.adaptSize(theme.spacing.none)}px;
    `}
`
