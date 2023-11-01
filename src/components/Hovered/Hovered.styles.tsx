import styled, {css} from 'styled-components/native';
import {HoveredProps} from './Hovered';
import {Shape} from '../Common/Shape.styles';

export type ContainerProps = Pick<HoveredProps, 'underlayColor'>;

export const Container = styled(Shape)<ContainerProps>`
    position: absolute;
    pointer-events: none;

    ${({underlayColor}) => css`
        background-color: ${underlayColor};
    `}
`;
