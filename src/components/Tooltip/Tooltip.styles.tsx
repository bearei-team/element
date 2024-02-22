import styled, {css} from 'styled-components/native';
import {Shape, Typography} from '../Common/Common.styles';
import {RenderProps} from './TooltipBase';

export interface ContainerProps {
    height?: number;
    width?: number;
}

export interface SupportingProps extends Pick<RenderProps, 'type' | 'position'> {
    height?: number;
    width?: number;
}

export const Container = styled.View<ContainerProps>`
    position: relative;

    ${({width, height}) =>
        typeof width === 'number' &&
        css`
            width: ${width}px;
            height: ${height}px;
        `}
`;

export const Supporting = styled(Shape)<SupportingProps>`
    position: absolute;
    z-index: 1024;

    ${({theme}) => css`
        min-width: ${theme.adaptSize(theme.spacing.small * 8)}px;
    `}

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

    ${({theme, height = 0, width = 0, position = 'verticalStart'}) => {
        const supportingPosition = {
            verticalStart: css`
                left: 50%;
                top: ${-(height + theme.adaptSize(theme.spacing.extraSmall))}px;
            `,
            verticalEnd: css`
                left: 50%;
                bottom: ${-(height + theme.adaptSize(theme.spacing.extraSmall))}px;
            `,
            horizontalStart: css`
                top: 50%;
                left: ${-(width + theme.adaptSize(theme.spacing.extraSmall))}px;
            `,
            horizontalEnd: css`
                top: 50%;
                right: ${-(width + theme.adaptSize(theme.spacing.extraSmall))}px;
            `,
        };

        return supportingPosition[position];
    }}
`;

export const SupportingText = styled(Typography)`
    text-align: center;
    user-select: none;

    ${({theme}) => css`
        color: ${theme.palette.inverse.inverseOnSurface};
    `}
`;
