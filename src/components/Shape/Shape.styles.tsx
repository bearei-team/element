import styled, {css} from 'styled-components/native';
import {ShapeProps} from './Shape';
import {Animated} from 'react-native';

export type ContainerProps = Pick<ShapeProps, 'shape'>;

export const Container = styled(Animated.View)<ContainerProps>`
    overflow: hidden;

    ${({theme, shape = 'none'}) => css`
        border-top-left-radius: ${theme.shape[shape].topLeft}px;
        border-top-right-radius: ${theme.shape[shape].topRight}px;
        border-bottom-left-radius: ${theme.shape[shape].bottomLeft}px;
        border-bottom-right-radius: ${theme.shape[shape].bottomLeft}px;
    `}
`;
