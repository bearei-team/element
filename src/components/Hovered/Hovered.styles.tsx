import styled, {css} from 'styled-components/native';

import {Animated} from 'react-native';
import {HoveredProps} from './Hovered';

export type ContainerProps = Pick<HoveredProps, 'width' | 'height' | 'underlayColor'>;

export const Container = styled(Animated.View)<ContainerProps>`
    position: absolute;
    pointer-events: none;

    ${({width = 0, height = 0, underlayColor}) => css`
        width: ${width}px;
        height: ${height}px;
        background-color: ${underlayColor};
    `}
`;
