import {Shape as ThemeShape} from '@bearei/theme';
import {Animated, View} from 'react-native';
import styled, {css} from 'styled-components/native';

export interface ShapeProps {
    border?: {
        color?: string | Animated.AnimatedInterpolation<string | number>;
        style?: 'dotted' | 'solid' | 'dashed';
        width?: number | Animated.AnimatedInterpolation<string | number>;
    };
    shape?: keyof ThemeShape;
}

export interface DisabledProps {
    height: number;
    width: number;
}

const Shape = styled(View)<ShapeProps>`
    ${({shape = 'none', theme}) => css`
        border-bottom-left-radius: ${theme.shape[shape].bottomLeft}px;
        border-bottom-right-radius: ${theme.shape[shape].bottomLeft}px;
        border-top-left-radius: ${theme.shape[shape].topLeft}px;
        border-top-right-radius: ${theme.shape[shape].topRight}px;
    `}

    ${({border, theme}) => {
        const {color = theme.palette.primary, style = 'solid', width = 1} = border ?? {};
        const isAnimatedInterpolation = typeof color !== 'string' || typeof width !== 'number';

        return (
            border &&
            !isAnimatedInterpolation &&
            css`
                border-color: ${color};
                border-style: ${style};
                border-width: ${width}px;
            `
        );
    }}
`;

const Disabled = styled(Shape)<DisabledProps>`
    left: 0;
    opacity: 0.04;
    pointer-events: none;
    position: absolute;
    top: 0;
    z-index: 128;

    ${({height, theme, width}) =>
        css`
            background-color: ${theme.palette.surface.onSurface};
            height: ${height}px;
            width: ${width}px;
        `}
`;

export {Disabled, Shape};
