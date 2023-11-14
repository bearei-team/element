import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {HoveredProps} from './Hovered';

export type ContainerProps = Pick<HoveredProps, 'underlayColor'>;

const Container = styled(Shape)<ContainerProps>`
    left: 0;
    pointer-events: none;
    position: absolute;
    top: 0;

    ${({underlayColor}) =>
        underlayColor &&
        css`
            background-color: ${underlayColor};
        `}
`;

export {Container};
