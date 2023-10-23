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

        return css``;
    }};
`;

export const Shadow1 = styled(ShapeContainer)<ShadowProps>`
    position: absolute;
    z-index: -1;

    ${({theme, level = 0}) => {
        const levelString = `level${level}` as keyof Elevation;

        console.info(
            theme.elevation[levelString].shadow1.x,
            theme.elevation[levelString].shadow1.y,
            theme.elevation[levelString].shadow1.opacity,
        );

        return css``;
    }};
`;
