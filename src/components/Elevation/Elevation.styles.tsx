import {Elevation} from '@bearei/theme';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './ElevationBase';

export type ContainerProps = {
    height: number;
    width: number;
};

export interface ShadowProps
    extends Pick<RenderProps & ContainerProps, 'level' | 'width' | 'height'> {
    shadow: 0 | 1;
}

export const Container = styled(Shape)<ContainerProps>`
    position: relative;

    ${({width = 0, height = 0}) =>
        css`
            width: ${width}px;
            height: ${height}px;
        `}
`;

export const Content = styled(Shape)`
    position: absolute;
    z-index: 2;
`;

export const Shadow = styled(Shape)<ShadowProps>`
    position: absolute;

    ${({theme}) => css`
        background-color: ${theme.palette.primary.onPrimary};
    `};

    ${({theme, level = 0, shadow = 0}) => {
        const levelString: keyof Elevation = `level${level}`;
        const shadowString: 'shadow0' | 'shadow1' = `shadow${shadow}`;

        return css`
            elevation: ${theme.elevation[levelString][shadowString].elevation};
            shadow-color: ${theme.palette.shadow.shadow};
            shadow-offset: ${theme.adaptSize(
                    theme.elevation[levelString][shadowString].x,
                )}px
                ${theme.adaptSize(
                    theme.elevation[levelString][shadowString].y,
                )}px;

            shadow-opacity: 1;
            shadow-radius: ${theme.adaptSize(
                theme.elevation[levelString][shadowString].blur,
            )}px;

            z-index: ${shadow};
        `;
    }};

    ${({width, height}) =>
        css`
            width: ${width}px;
            height: ${height}px;
        `}
`;
