import styled, {css} from 'styled-components/native'
import {PlatformInlineView, Typography} from '../Common/Common.styles'
import {RenderProps} from './ButtonBase'

type ContainerProps = Pick<RenderProps, 'block'>
interface ContentProps extends Pick<RenderProps, 'type' | 'block'> {
    iconShow: boolean
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

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.small * 5)}px;
    `}

    ${({theme, iconShow}) =>
        iconShow &&
        css`
            gap: ${theme.adaptSize(theme.spacing.small)}px;
        `}

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.small)}px;
    `}

    ${({theme, type = 'filled'}) => {
        const contentType = {
            elevated: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 10 + 3)}px;
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(theme.spacing.large)}px;
            `,
            filled: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 10 + 3)}px;
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(theme.spacing.large)}px;
            `,
            outlined: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 10 + 3)}px;
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(theme.spacing.large)}px;
            `,
            text: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 7 + 3)}px;
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(
                        theme.spacing.medium - theme.spacing.extraSmall
                    )}px;
            `,
            link: css`
                height: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            tonal: css`
                min-width: ${theme.adaptSize(theme.spacing.small * 10 + 3)}px;
                padding: ${theme.adaptSize(theme.spacing.small + 2)}px
                    ${theme.adaptSize(theme.spacing.large)}px;
            `
        }

        return contentType[type]
    }}

    ${({iconShow, theme, type = 'filled'}) => {
        const contentType = {
            elevated: css`
                padding-left: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            filled: css`
                padding-left: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            outlined: css`
                padding-left: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            text: css`
                padding-left: ${theme.adaptSize(theme.spacing.medium - 4)}px;
                padding-right: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            link: css``,
            tonal: css`
                padding-left: ${theme.adaptSize(theme.spacing.medium)}px;
            `
        }

        return iconShow && contentType[type]
    }}
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
