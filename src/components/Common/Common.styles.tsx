import {Shape as ThemeShape, Typography as ThemeTypography} from '@bearei/theme';
import {View, ViewStyle} from 'react-native';
import styled, {css} from 'styled-components/native';
import {AnimatedInterpolation, Size} from './interface';

export interface ShapeProps {
    border?: {
        color?: string | AnimatedInterpolation;
        style?: ViewStyle['borderStyle'];
        width?: number | AnimatedInterpolation;
    };
    shape?: keyof ThemeShape;
}

export interface TypographyProps {
    size?: Size;
    type?: keyof ThemeTypography;
    multiline?: boolean;
}

export const Shape = styled(View)<ShapeProps>`
    ${({shape = 'none', theme}) => css`
        border-bottom-left-radius: ${theme.adaptSize(theme.shape[shape].bottomLeft)}px;
        border-bottom-right-radius: ${theme.adaptSize(theme.shape[shape].bottomRight)}px;
        border-top-left-radius: ${theme.adaptSize(theme.shape[shape].topLeft)}px;
        border-top-right-radius: ${theme.adaptSize(theme.shape[shape].topRight)}px;
    `}

    ${({border = {}, theme}) => {
        const {color = theme.palette.primary, style = 'solid', width = theme.adaptSize(1)} = border;
        const animatedInterpolation = typeof color !== 'string' || typeof width !== 'number';

        return (
            border &&
            !animatedInterpolation &&
            css`
                border-color: ${color};
                border-style: ${style};
                border-width: ${width}px;
            `
        );
    }}
`;

export const Typography = styled.Text<TypographyProps>`
    ${({theme, type = 'title', size = 'medium'}) =>
        css`
            align-items: center;
            color: ${theme.palette.surface.onSurfaceVariant};
            display: flex;
            font-size: ${theme.adaptFontSize(theme.typography[type][size].size)}px;
            font-style: ${theme.typography[type][size].style};
            font-weight: ${theme.typography[type][size].weight};
            height: ${theme.adaptSize(theme.typography[type][size].lineHeight)}px;
            letter-spacing: ${theme.adaptSize(theme.typography[type][size].letterSpacing)}px;
            line-height: ${theme.adaptSize(theme.typography[type][size].lineHeight)}px;
        `}

    ${({theme, type = 'title', size = 'medium', multiline = false}) =>
        multiline &&
        css`
            line-height: ${theme.adaptSize(theme.typography[type][size].lineHeight)}px;
        `}
`;
