import styled, {css} from 'styled-components/native'
import {PlatformInlineView, Typography} from '../Common/Common.styles'
import {RenderProps} from './ChipBase'

type ContainerProps = Pick<RenderProps, 'block'>
interface ContentProps extends Pick<RenderProps, 'type' | 'block'> {
    iconShow: boolean
    trailingIconShow: boolean
}

export const Container = styled(PlatformInlineView)<ContainerProps>`
    position: relative;

    ${({block}) =>
        block &&
        css`
            width: 100%;
        `}
`

export const Content = styled.View<ContentProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;
    position: relative;
    z-index: 1;

    ${({theme, iconShow}) =>
        iconShow &&
        css`
            gap: ${theme.adaptSize(theme.spacing.small)}px;
        `}

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.small * 4)}px;
    `}

    ${({theme, type = 'filter'}) => {
        const contentType = {
            input: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 8 + 3)}px;
                padding: ${theme.adaptSize(theme.spacing.extraSmall + 2)}px
                    ${theme.adaptSize(
                        theme.spacing.medium - theme.spacing.extraSmall
                    )}px;
            `,
            assist: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 8 + 3)}px;
                padding: ${theme.adaptSize(theme.spacing.extraSmall + 2)}px
                    ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            filter: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 8 + 3)}px;
                padding: ${theme.adaptSize(theme.spacing.extraSmall + 2)}px
                    ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            suggestion: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 8 + 3)}px;
                padding: ${theme.adaptSize(theme.spacing.extraSmall + 2)}px
                    ${theme.adaptSize(theme.spacing.medium)}px;
            `
        }

        return contentType[type]
    }}

    ${({iconShow, theme}) =>
        iconShow &&
        css`
            padding-left: ${theme.adaptSize(theme.spacing.small)}px;
        `}

    ${({trailingIconShow, theme}) =>
        trailingIconShow &&
        css`
            padding-right: ${theme.adaptSize(theme.spacing.small)}px;
        `}
`

export const LabelText = styled(Typography)`
    text-align: center;
    user-select: none;
`

export const Icon = styled.View`
    overflow: hidden;

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.large - 4)}px;
        width: ${theme.adaptSize(theme.spacing.large - 4)}px;
    `}
`
