import styled, {css} from 'styled-components/native';
import {Animated} from 'react-native';
import {RenderProps} from './BaseRipple';

export type ContainerProps = RenderProps;

export const Container = styled(Animated.View)<ContainerProps>`
    position: absolute;
    border-radius: 50%;
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
        `}
`;
