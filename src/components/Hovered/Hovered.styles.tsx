import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './HoveredBase';

export type ContainerProps = Pick<
    RenderProps,
    'underlayColor' | 'width' | 'height'
>;

export const Container = styled(Shape)<ContainerProps>`
    left: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    z-index: -1;

    ${({underlayColor, width, height}) =>
        underlayColor &&
        css`
            background-color: ${underlayColor};
            height: ${height}px;
            width: ${width}px;
        `}
`;
