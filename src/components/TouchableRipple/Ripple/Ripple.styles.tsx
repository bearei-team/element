import styled, {css} from 'styled-components/native';
import {Shape} from '../../Common/Common.styles';
import {RenderProps} from './RippleBase';

export type ContainerProps = Omit<RenderProps, 'renderStyle'> & {
    height: number;
    width: number;
    x: number;
    y: number;
};

export const Container = styled(Shape)<ContainerProps>`
    pointer-events: none;
    position: absolute;
    z-index: 128;

    ${({isRTL, x}) =>
        isRTL
            ? css`
                  right: ${x}px;
              `
            : css`
                  left: ${x}px;
              `}

    ${({height, width, y}) => css`
        height: ${height}px;
        top: ${y}px;
        width: ${width}px;
    `}

    ${({underlayColor, theme}) =>
        underlayColor &&
        css`
            background-color: ${theme.color.rgba(underlayColor, 0.12)};
        `};
`;
