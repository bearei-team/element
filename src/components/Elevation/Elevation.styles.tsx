import {Elevation} from '@bearei/theme';
import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './ElevationBase';

type ContainerProps = {
    renderStyle?: {width?: number; height?: number};
};

interface ShadowProps
    extends Pick<Omit<RenderProps, 'renderStyle'> & ContainerProps, 'level' | 'renderStyle'> {
    shadowIndex: 0 | 1;
}

export const Container = styled(View)<ContainerProps>`
    position: absolute;
    z-index: -1;

    ${({theme}) => css`
        bottom: ${theme.adaptSize(theme.spacing.none)}px;
        left: ${theme.adaptSize(theme.spacing.none)}px;
        right: ${theme.adaptSize(theme.spacing.none)}px;
        top: ${theme.adaptSize(theme.spacing.none)}px;
    `};

    ${({renderStyle = {}}) => {
        const {width = 0, height = 0} = renderStyle;

        return (
            width !== 0 &&
            css`
                height: ${height}px;
                width: ${width}px;
            `
        );
    }}
`;

export const Shadow = styled(Shape)<ShadowProps>`
    position: absolute;

    ${({theme}) => css`
        background-color: ${theme.palette.surface.surface};
        bottom: ${theme.adaptSize(theme.spacing.none)}px;
        left: ${theme.adaptSize(theme.spacing.none)}px;
        right: ${theme.adaptSize(theme.spacing.none)}px;
        top: ${theme.adaptSize(theme.spacing.none)}px;
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

        return (
            width !== 0 &&
            css`
                height: ${height}px;
                width: ${width}px;
            `
        );
    }}
`;
