import styled, {css} from 'styled-components/native';
import {RenderRippleContainerProps} from './BaseRipple';
import {Animated} from 'react-native';

export type ContainerProps = Pick<
    RenderRippleContainerProps,
    'x' | 'y' | 'isRTL' | 'underlayColor'
>;

export const baseRadius = 10;
export const Container = styled.View<ContainerProps>`
    position: absolute;

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

export const Main = styled(Animated.View)`
    width: ${baseRadius * 2}px;
    height: ${baseRadius * 2}px;
    border-radius: ${baseRadius * 2}px;
    background-color: rgba(255, 255, 255, 0.12);
`;
