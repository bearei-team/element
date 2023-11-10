import {Elevation} from '@bearei/theme';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {ElevationProps} from './Elevation';

export interface ShadowProps extends Pick<ElevationProps, 'level'> {
    shadow: 0 | 1;
}

export const Container = styled(Shape)`
    position: relative;
`;

export const Main = styled(Shape)`
    position: absolute;
    z-index: 2;
`;

export const Shadow0 = styled(Shape)<ShadowProps>`
    position: absolute;
    z-index: 0;

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
            shadow-opacity: 1;
            elevation: ${theme.elevation[levelString][shadowString].elevation};
        `;
    }};
`;

export const Shadow1 = styled(Shadow0)`
    z-index: 1;
`;
