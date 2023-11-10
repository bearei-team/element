import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {HoveredProps} from './Hovered';

export type ContainerProps = Pick<HoveredProps, 'underlayColor'>;

export const Container = styled(Shape)<ContainerProps>`
    position: absolute;
    pointer-events: none;
    top: 0;
    left: 0;

    ${({underlayColor}) => css`
        background-color: ${underlayColor};
    `}
`;
