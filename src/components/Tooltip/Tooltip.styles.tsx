import styled, {css} from 'styled-components/native';
import {Shape, Typography} from '../Common/Common.styles';
import {RenderProps} from './TooltipBase';

export interface ContainerProps {
    height?: number;
    width?: number;
}

export interface SupportingProps
    extends Pick<RenderProps, 'type' | 'supportingPosition' | 'visible'> {
    containerHeight?: number;
    containerWidth?: number;
    height?: number;
    pageX?: number;
    pageY?: number;
    width?: number;
}

export const Container = styled.View<ContainerProps>`
    position: relative;

    ${({width, height}) =>
        typeof width === 'number' &&
        css`
            height: ${height}px;
            width: ${width}px;
        `}
`;

export const Supporting = styled(Shape)<SupportingProps>`
    position: absolute;
    z-index: 1024;

    ${({theme, type = 'plain'}) => {
        const supportingType = {
            plain: css`
                background-color: ${theme.palette.inverse.inverseSurface};
                min-height: ${theme.adaptSize(theme.spacing.large)}px;
                padding: ${theme.adaptSize(theme.spacing.extraSmall)}px
                    ${theme.adaptSize(theme.spacing.small)}px;
            `,
            rich: css``,
        };

        return supportingType[type];
    }}

    ${({
        containerHeight = 0,
        containerWidth = 0,
        height = 0,
        pageX = 0,
        pageY = 0,
        supportingPosition: position = 'verticalStart',
        theme,
        width = 0,
    }) => {
        const supportingPosition = {
            verticalStart: css`
                left: ${pageX + containerWidth / 2}px;
                top: ${pageY - (height + theme.adaptSize(theme.spacing.extraSmall))}px;
            `,
            verticalEnd: css`
                left: ${pageX + containerWidth / 2}px;
                top: ${pageY + containerHeight + theme.adaptSize(theme.spacing.extraSmall)}px;
            `,
            horizontalStart: css`
                top: ${pageY + containerHeight / 2}px;
                left: ${pageX - (width + theme.adaptSize(theme.spacing.extraSmall))}px;
            `,
            horizontalEnd: css`
                top: ${pageY + containerHeight / 2}px;
                left: ${pageX + (containerWidth + theme.adaptSize(theme.spacing.extraSmall))}px;
            `,
        };

        return supportingPosition[position];
    }}

${({visible = false}) =>
        !visible &&
        css`
            z-index: -1024;
        `}
`;

export const SupportingText = styled(Typography)`
    text-align: center;
    user-select: none;

    ${({theme}) => css`
        color: ${theme.palette.inverse.inverseOnSurface};
    `}
`;
