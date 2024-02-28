import styled, {css} from 'styled-components/native';
import {Shape} from '../../Common/Common.styles';
import {RenderProps} from './RippleBase';

interface ContainerProps extends Pick<RenderProps, 'underlayColor' | 'active'> {
    locationX?: number;
    locationY?: number;
    renderStyle?: {height?: number; width?: number};
}

export const Container = styled(Shape)<ContainerProps>`
    overflow: hidden;
    pointer-events: none;
    position: absolute;

    ${({renderStyle = {}, locationY = 0, locationX = 0}) => {
        const {height = 0, width = 0} = renderStyle;

        return css`
            height: ${height}px;
            left: ${locationX}px;
            top: ${locationY}px;
            width: ${width}px;
        `;
    }}

    ${({underlayColor, theme, active}) => {
        const activeRipple = typeof active === 'boolean';

        return css`
            background-color: ${activeRipple
                ? underlayColor
                : theme.color.convertHexToRGBA(
                      underlayColor ?? theme.palette.surface.surface,
                      0.12,
                  )};

            z-index: -1;
        `;
    }};

    ${({active}) =>
        typeof active === 'boolean' &&
        !active &&
        css`
            z-index: ${-1024};
        `};
`;
