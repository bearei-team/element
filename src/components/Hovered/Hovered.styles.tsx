import styled, {css} from 'styled-components/native';
import {HoveredProps} from './Hovered';
import {Shape} from '../Common/Shape.styles';

export type ContainerProps = Pick<HoveredProps, 'width' | 'height' | 'underlayColor'>;

export const Container = styled(Shape)<ContainerProps>`
    position: absolute;
    pointer-events: none;

    ${({width = 0, height = 0, underlayColor}) => css`
        width: ${width}px;
        height: ${height}px;
        background-color: ${underlayColor};
    `}
`;
