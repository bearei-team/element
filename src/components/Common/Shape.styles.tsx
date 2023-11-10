import styled, {css} from 'styled-components/native';
import {Shape as ThemeShape} from '@bearei/theme';
import {View} from 'react-native';

export interface ShapeProps {
    shape?: keyof ThemeShape;
    border?: {
        width?: number;
        style?: 'dotted' | 'solid' | 'dashed';
        color?: string;
    };
}

export interface DisabledProps {
    width: number;
    height: number;
}

export const Shape = styled(View)<ShapeProps>`
    ${({theme, shape = 'none'}) => css`
        border-top-left-radius: ${theme.shape[shape].topLeft}px;
        border-top-right-radius: ${theme.shape[shape].topRight}px;
        border-bottom-left-radius: ${theme.shape[shape].bottomLeft}px;
        border-bottom-right-radius: ${theme.shape[shape].bottomLeft}px;
    `}

    ${({border, theme}) => {
        const {width = 1, style = 'solid', color = theme.palette.primary} = border ?? {};

        return (
            border &&
            css`
                border-width: ${width}px;
                border-style: ${style};
                border-color: ${color};
            `
        );
    }}
`;

export const Disabled = styled(Shape)<DisabledProps>`
    position: absolute;
    pointer-events: none;
    top: 0;
    left: 0;
    z-index: 128;
    opacity: 0.04;

    ${({theme, width, height}) =>
        css`
            width: ${width}px;
            height: ${height}px;
            background-color: ${theme.palette.surface.onSurface};
        `}
`;
