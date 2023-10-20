import styled, {css} from 'styled-components/native';
import {RenderContainerProps, RenderMainProps} from './BaseRipple';
import {Animated} from 'react-native';

export type ContainerProps = Pick<RenderContainerProps, 'x' | 'y' | 'isRTL'>;
export type MainProps = Pick<RenderMainProps, 'underlayColor'>;

export const baseRadius = 10;
export const Container = styled.View<ContainerProps>`
    position: absolute;
    z-index: -1;

    ${({x, isRTL}) =>
        isRTL
            ? css`
                  right: ${x}px;
              `
            : css`
                  left: ${x}px;
              `}

    ${({y}) => css`
        top: ${y}px;
    `}
`;

export const Main = styled(Animated.View)<MainProps>`
    width: ${baseRadius * 2}px;
    height: ${baseRadius * 2}px;
    border-radius: ${baseRadius * 2}px;

    ${({underlayColor, theme}) =>
        css`
            background-color: ${underlayColor ?? theme.palette.surface.onSurface};
        `}
`;
