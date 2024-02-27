import styled, {css} from 'styled-components/native';
import {Shape, Typography} from '../../Common/Common.styles';
import {RenderProps} from './SupportingBase';

export interface ContainerProps
    extends Pick<RenderProps, 'type' | 'supportingPosition' | 'visible'> {
    containerPageX?: number;
    containerPageY?: number;
    containerWidth?: number;
    containerHeight?: number;
    layoutWidth?: number;
    layoutHeight?: number;
}

type InnerProps = Pick<RenderProps, 'type' | 'supportingPosition'>;
export const Container = styled.Pressable<ContainerProps>`
    position: absolute;
    z-index: 5120;

    ${({
        containerHeight = 0,
        containerPageX = 0,
        containerPageY = 0,
        containerWidth = 0,
        layoutHeight = 0,
        layoutWidth = 0,
        supportingPosition: position = 'verticalStart',
        theme,
    }) => {
        const supportingPosition = {
            verticalStart: css`
                left: ${containerPageX + containerWidth / 2}px;
                padding-bottom: ${theme.adaptSize(theme.spacing.extraSmall)}px;
                top: ${containerPageY - layoutHeight}px;
            `,
            verticalEnd: css`
                left: ${containerPageX + containerWidth / 2}px;
                padding-top: ${theme.adaptSize(theme.spacing.extraSmall)}px;
                top: ${containerPageY + containerHeight}px;
            `,
            horizontalStart: css`
                left: ${containerPageX - layoutWidth}px;
                padding-right: ${theme.adaptSize(theme.spacing.extraSmall)}px;
                top: ${containerPageY + containerHeight / 2}px;
            `,
            horizontalEnd: css`
                left: ${containerPageX + containerWidth}px;
                padding-left: ${theme.adaptSize(theme.spacing.extraSmall)}px;
                top: ${containerPageY + containerHeight / 2}px;
            `,
        };

        return supportingPosition[position];
    }}

    ${({visible = false, theme}) =>
        !visible &&
        css`
            height: ${theme.adaptSize(theme.spacing.none)}px;
            overflow: hidden;
            padding: ${theme.adaptSize(theme.spacing.none)}px;
            z-index: -1024;
        `}
`;

export const Inner = styled(Shape)<InnerProps>`
    pointer-events: none;

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
`;

export const SupportingText = styled(Typography)`
    text-align: center;
    user-select: none;

    ${({theme}) => css`
        color: ${theme.palette.inverse.inverseOnSurface};
    `}
`;
