import {Elevation} from '@bearei/theme';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {ElevationProps} from './Elevation';

export interface ShadowProps extends Pick<ElevationProps, 'level'> {
    shadow: 0 | 1;
}

const Container = styled(Shape)`
    position: relative;
`;

const Main = styled(Shape)`
    position: absolute;
    z-index: 2;
`;

const Shadow0 = styled(Shape)<ShadowProps>`
    position: absolute;
    z-index: 0;

    ${({theme}) => css`
        background-color: ${theme.palette.primary.onPrimary};
    `};

    ${({theme, level = 0, shadow = 0}) => {
        const levelString: keyof Elevation = `level${level}`;
        const shadowString: 'shadow0' | 'shadow1' = `shadow${shadow}`;

        return css`
            elevation: ${theme.elevation[levelString][shadowString].elevation};
            shadow-color: ${theme.palette.shadow.shadow};
            shadow-offset: ${theme.elevation[levelString][shadowString].x}px
                ${theme.elevation[levelString][shadowString].y}px;

            shadow-opacity: 1;
            shadow-radius: ${theme.elevation[levelString][shadowString].blur}px;
        `;
    }};
`;

const Shadow1 = styled(Shadow0)`
    z-index: 1;
`;

export {Container, Main, Shadow0, Shadow1};
