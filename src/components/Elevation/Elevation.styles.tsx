import styled, {css} from 'styled-components/native';
import {ElevationProps} from './Elevation';
import {Elevation} from '@bearei/theme';
import {Shape} from '../Common/Shape.styles';

export interface ShadowProps extends Pick<ElevationProps, 'level'> {
    shadow: 0 | 1;
}

export const Container = styled(Shape)<ShadowProps>`
    ${({theme}) => css`
        background-color: ${theme.palette.primary.onPrimary};
    `};

    ${({theme, level = 0, shadow = 0}) => {
        const levelString: keyof Elevation = `level${level}`;
        const shadowString = `shadow${shadow}` as 'shadow0' | 'shadow1';

        return css`
            shadow-color: ${theme.palette.shadow.shadow};
            shadow-offset: ${theme.elevation[levelString][shadowString].x}px
                ${theme.elevation[levelString][shadowString].y}px;

            shadow-radius: ${theme.elevation[levelString][shadowString].blur}px;
            shadow-opacity: ${theme.elevation[levelString][shadowString].opacity};
            elevation: ${theme.elevation[levelString][shadowString].elevation};
        `;
    }};
`;

export const Main = styled(Container)``;
