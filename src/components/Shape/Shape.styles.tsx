import styled, {css} from 'styled-components/native';
import {ShapeProps} from './Shape';
import {Animated} from 'react-native';

export type ContainerProps = Pick<ShapeProps, 'shape' | 'border'>;

export const Container = styled(Animated.View)<ContainerProps>`
    overflow: hidden;

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
