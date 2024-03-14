import {Elevation} from '@bearei/theme';
import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './ElevationBase';

type ContainerProps = {
    renderStyle?: {width?: number; height?: number};
} & Pick<RenderProps, 'block'>;

interface ShadowProps extends Pick<RenderProps & ContainerProps, 'level' | 'renderStyle'> {
    shadowIndex: 0 | 1;
}

type ContentProps = ContainerProps;

export const Container = styled(View)<ContainerProps>`
    position: relative;

    ${({block, renderStyle = {}}) => {
        const {width = 0, height = 0} = renderStyle;

        return !block
            ? css`
                  height: ${height}px;
                  width: ${width}px;
              `
            : css`
                  align-self: stretch;
                  flex: 1;
              `;
    }}
`;

export const Content = styled(Shape)<ContentProps>`
    position: absolute;
    z-index: 2;

    ${({block, renderStyle = {}}) => {
        const {width = 0, height = 0} = renderStyle;

        return (
            block &&
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
        top: ${theme.adaptSize(theme.spacing.none)}px;
        left: ${theme.adaptSize(theme.spacing.none)}px;
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
