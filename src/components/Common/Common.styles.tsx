import {Shape as ThemeShape} from '@bearei/theme';
import {View, ViewStyle} from 'react-native';
import styled, {css} from 'styled-components/native';
import {AnimatedInterpolation} from './interface';

export interface ShapeProps {
    border?: {
        color?: string | AnimatedInterpolation;
        style?: ViewStyle['borderStyle'];
        width?: number | AnimatedInterpolation;
    };
    shape?: keyof ThemeShape;
}

export interface DisabledProps {
    height: number;
    width: number;
}

export const Shape = styled(View)<ShapeProps>`
    ${({shape = 'none', theme}) => css`
        border-bottom-left-radius: ${theme.adaptSize(
            theme.shape[shape].bottomLeft,
        )}px;

        border-bottom-right-radius: ${theme.adaptSize(
            theme.shape[shape].bottomLeft,
        )}px;

        border-top-left-radius: ${theme.adaptSize(
            theme.shape[shape].topLeft,
        )}px;

        border-top-right-radius: ${theme.adaptSize(
            theme.shape[shape].topRight,
        )}px;
    `}

    ${({border = {}, theme}) => {
        const {
            color = theme.palette.primary,
            style = 'solid',
            width = theme.adaptSize(1),
        } = border;

        const isAnimatedInterpolation =
            typeof color !== 'string' || typeof width !== 'number';

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
