import styled, {css} from 'styled-components/native';
import {ElevationProps} from './Elevation';
import {Container as ShapeContainer} from '../Shape/Shape.styles';
import {Elevation} from '@bearei/theme';

export type ShadowProps = Pick<ElevationProps, 'level'>;

export const Container = styled.View`
    position: relative;
`;

export const Shadow0 = styled(ShapeContainer)<ShadowProps>`
    position: absolute;
    z-index: -2;

    ${({theme, level = 0}) => {
        const levelString = `level${level}` as keyof Elevation;

        return css`
            shadow-color: ${theme.palette.shadow.shadow};
            shadow-offset: ${theme.elevation[levelString].shadow0.x}px
                ${theme.elevation[levelString].shadow0.y}px;
            shadow-radius: ${theme.elevation[levelString].shadow0.blur}px;
        `;
    }};
`;

export const Shadow1 = styled(ShapeContainer)<ShadowProps>`
    position: absolute;
    z-index: -1;

    ${({theme, level = 0}) => {
        const levelString = `level${level}` as keyof Elevation;

        return css`
            shadow-color: ${theme.palette.shadow.shadow};
            shadow-offset: ${theme.elevation[levelString].shadow1.x}px
                ${theme.elevation[levelString].shadow0.y}px;
            shadow-radius: ${theme.elevation[levelString].shadow1.blur}px;
        `;
    }};
`;
