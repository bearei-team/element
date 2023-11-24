import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {HoveredProps} from './Hovered';

export type ContainerProps = Pick<HoveredProps, 'underlayColor' | 'width' | 'height'>;

const Container = styled(Shape)<ContainerProps>`
    left: 0;
    pointer-events: none;
    position: absolute;
    top: 0;

    ${({underlayColor, width, height}) =>
        underlayColor &&
        css`
            background-color: ${underlayColor};
            width: ${width}px;
            height: ${height}px;
        `}
`;

export {Container};
