import styled, {css} from 'styled-components/native';
import {ElevationProps} from './Elevation';
import {Elevation} from '@bearei/theme';
import {Shape} from '../Common/Shape.styles';

export const Container = styled(Shape)<ElevationProps>`
    ${({theme}) => css`
        background-color: ${theme.palette.primary.onPrimary};
    `};

    ${({theme, level = 0}) => {
        const levelString: keyof Elevation = `level${level}`;

        return css`
            shadow-color: ${theme.palette.shadow.shadow};
            shadow-offset: ${theme.elevation[levelString].shadow0.x}px
                ${theme.elevation[levelString].shadow0.y}px;

            shadow-radius: ${theme.elevation[levelString].shadow0.blur}px;
            elevation: ${theme.elevation[levelString].shadow0.elevation};
        `;
    }};
`;

export const Main = styled(Shape)<ElevationProps>`
    ${({theme}) => css`
        background-color: ${theme.palette.primary.onPrimary};
    `};

    ${({theme, level = 0}) => {
        const levelString: keyof Elevation = `level${level}`;

        return css`
            shadow-color: ${theme.palette.shadow.shadow};
            shadow-offset: ${theme.elevation[levelString].shadow1.x}px
                ${theme.elevation[levelString].shadow1.y}px;

            shadow-radius: ${theme.elevation[levelString].shadow1.blur}px;
            elevation: ${theme.elevation[levelString].shadow1.elevation};
        `;
    }};
`;
