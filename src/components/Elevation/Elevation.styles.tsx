import {Elevation} from '@bearei/theme';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './ElevationBase';

export interface ContainerProps {
    renderStyle?: {width?: number; height?: number};
}

export interface ShadowProps extends Pick<RenderProps & ContainerProps, 'level' | 'renderStyle'> {
    shadowIndex: 0 | 1;
}

export const Container = styled(Shape)<ContainerProps>`
    position: relative;

    ${({renderStyle = {}}) => {
        const {width = 0, height = 0} = renderStyle;

        return css`
            height: ${height}px;
            width: ${width}px;
        `;
    }}
`;

export const Content = styled(Shape)`
    position: absolute;
    z-index: 2;
`;

export const Shadow = styled(Shape)<ShadowProps>`
    left: 0;
    position: absolute;
    top: 0;

    ${({theme}) => css`
        background-color: ${theme.palette.surface.surface};
    `};

    ${({theme, level = 0, shadowIndex = 0}) => {
        const levelString: keyof Elevation = `level${level}`;
        const shadowString: 'shadow0' | 'shadow1' = `shadow${shadowIndex}`;

        return css`
            elevation: ${theme.elevation[levelString][shadowString].elevation};
            shadow-color: ${theme.palette.shadow.shadow};
            shadow-offset: ${theme.adaptSize(theme.elevation[levelString][shadowString].x)}px
                ${theme.adaptSize(theme.elevation[levelString][shadowString].y)}px;
            shadow-opacity: 1;
            shadow-radius: ${theme.adaptSize(theme.elevation[levelString][shadowString].blur)}px;
            z-index: ${shadowIndex};
        `;
    }};

    ${({renderStyle = {}}) => {
        const {width = 0, height = 0} = renderStyle;

        return css`
            height: ${height}px;
            width: ${width}px;
        `;
    }}
`;
