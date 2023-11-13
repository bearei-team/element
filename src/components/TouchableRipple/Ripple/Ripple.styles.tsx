import styled, {css} from 'styled-components/native';
import {Shape} from '../../Common/Common.styles';
import {RenderProps} from './BaseRipple';

export type ContainerProps = RenderProps;

const Container = styled(Shape)<ContainerProps>`
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

    ${({hight, width, y}) => css`
        height: ${hight}px;
        top: ${y}px;
        width: ${width}px;
    `}

    ${({underlayColor, theme}) =>
        underlayColor &&
        css`
            background-color: ${theme.color.rgba(underlayColor, 0.12)};
        `};
`;

export {Container};
