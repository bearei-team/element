import styled, {css} from 'styled-components/native';
import {RenderProps} from './BaseRipple';
import {Shape} from '../../Common/Shape.styles';

export type ContainerProps = RenderProps;
export const Container = styled(Shape)<ContainerProps>`
    position: absolute;
    pointer-events: none;
    z-index: 100;

    ${({x, isRTL}) =>
        isRTL
            ? css`
                  right: ${x}px;
              `
            : css`
                  left: ${x}px;
              `}

    ${({y, width, hight}) => css`
        top: ${y}px;
        width: ${width}px;
        height: ${hight}px;
    `}

    ${({underlayColor, theme}) =>
        css`
            background-color: ${underlayColor
                ? theme.color.rgba(underlayColor, 0.12)
                : theme.palette.surface.onSurface};
        `};
`;
