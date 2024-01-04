import styled, {css} from 'styled-components/native';
import {Shape} from '../../Common/Common.styles';
import {RenderProps} from './RippleBase';

export type ContainerProps = Omit<RenderProps, 'renderStyle'> & {
    activeRipple: boolean;
    height: number;
    width: number;
    x: number;
    y: number;
};

export const Container = styled(Shape)<ContainerProps>`
    pointer-events: none;
    position: absolute;

    ${({height, width, y, x}) => css`
        height: ${height}px;
        left: ${x}px;
        top: ${y}px;
        width: ${width}px;
    `}

    ${({underlayColor}) =>
        underlayColor &&
        css`
            background-color: ${underlayColor};
        `};

    ${({activeRipple}) =>
        css`
            z-index: ${activeRipple ? -1 : 2048};
        `};
`;
