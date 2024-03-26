import {Shape as ThemeShape, Typography as ThemeTypography} from '@bearei/theme'
import {View, ViewStyle} from 'react-native'
import styled, {css} from 'styled-components/native'
import {AnimatedInterpolation, Size} from './interface'

export interface ShapeProps {
    border?: {
        color?: string | AnimatedInterpolation
        style?: ViewStyle['borderStyle']
        width?: number | AnimatedInterpolation
    }
    shape?: keyof ThemeShape
}

export interface TypographyProps {
    size?: Size
    type?: keyof ThemeTypography
    multiline?: boolean
}

export const Shape = styled(View)<ShapeProps>`
    ${({shape = 'none', theme}) => css`
        border-bottom-left-radius: ${theme.adaptSize(
            theme.shape[shape].bottomLeft
        )}px;

        border-bottom-right-radius: ${theme.adaptSize(
            theme.shape[shape].bottomRight
        )}px;

        border-top-left-radius: ${theme.adaptSize(
            theme.shape[shape].topLeft
        )}px;

        border-top-right-radius: ${theme.adaptSize(
            theme.shape[shape].topRight
        )}px;
    `}

    ${({border = {}, theme}) => {
        const {
            color = theme.palette.primary,
            style = 'solid',
            width = theme.adaptSize(1)
        } = border
        const animatedInterpolation =
            typeof color !== 'string' || typeof width !== 'number'

        return (
            border &&
            !animatedInterpolation &&
            css`
                border-color: ${color};
                border-style: ${style};
                border-width: ${width}px;
            `
        )
    }}
`

export const Typography = styled.Text<TypographyProps>`
    align-items: center;
    display: flex;
    flex-direction: row;

    ${({theme, type = 'title', size = 'medium'}) => css`
        color: ${theme.palette.surface.onSurfaceVariant};
        font-size: ${theme.adaptFontSize(theme.typography[type][size].size)}px;
        font-style: ${theme.typography[type][size].style};
        font-weight: ${theme.typography[type][size].weight};
        height: ${theme.adaptSize(theme.typography[type][size].lineHeight)}px;
        letter-spacing: ${theme.adaptSize(
            theme.typography[type][size].letterSpacing
        )}px;

        line-height: ${theme.adaptSize(
            theme.typography[type][size].lineHeight
        )}px;
    `}

    ${({multiline}) =>
        multiline &&
        css`
            height: auto;
        `}
`

export const PlatformInlineView = styled.View`
    align-items: center;
    cursor: default;
    display: flex;
    flex-direction: row;
    justify-content: center;

    ${({theme}) => {
        const os = {
            android: css``,
            ios: css``,
            macos: css``,
            web: css`
                display: inline-block;
                line-height: ${theme.adaptSize(theme.spacing.none)}px;
            `,
            windows: css``
        }

        return os[theme.OS]
    }}
`
