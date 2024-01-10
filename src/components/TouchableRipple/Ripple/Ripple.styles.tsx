import styled, {css} from 'styled-components/native';
import {Shape} from '../../Common/Common.styles';
import {RenderProps} from './RippleBase';

export interface ContainerProps extends Pick<RenderProps, 'underlayColor'> {
    height: number;
    width: number;
    locationX: number;
    locationY: number;
    activeRipple: boolean;
}

export const Container = styled(Shape)<ContainerProps>`
    pointer-events: none;
    position: absolute;

    ${({height, width, locationY, locationX}) => css`
        height: ${height}px;
        left: ${locationX}px;
        top: ${locationY}px;
        width: ${width}px;
    `}

    ${({underlayColor, theme, activeRipple}) =>
        css`
            background-color: ${activeRipple
                ? underlayColor
                : theme.color.rgba(
                      underlayColor ?? theme.palette.surface.surface,
                      0.12,
                  )};
        `};

    ${({activeRipple}) =>
        css`
            z-index: ${activeRipple ? -1 : 2048};
        `};
`;
