import styled, {css} from 'styled-components/native'

export const Container = styled.View`
    height: 100%;
    overflow: hidden;
    position: absolute;
    width: 100%;
    z-index: 8192;

    ${({theme}) => css`
        left: ${theme.adaptSize(theme.spacing.none)}px;
        top: ${theme.adaptSize(theme.spacing.none)}px;
    `}
`
