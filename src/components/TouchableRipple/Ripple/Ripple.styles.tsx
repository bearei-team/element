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
    z-index: 1024;

    ${({height, width, y, x}) => css`
        height: ${height}px;
        left: ${x}px;
        top: ${y}px;
        width: ${width}px;
    `}

    ${({underlayColor, theme}) =>
        underlayColor &&
        css`
            background-color: ${theme.color.rgba(underlayColor, 0.12)};
        `};
`;
