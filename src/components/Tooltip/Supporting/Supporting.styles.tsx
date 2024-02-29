import {Pressable} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape, Typography} from '../../Common/Common.styles';
import {RenderProps} from './SupportingBase';

interface ContainerProps extends Pick<RenderProps, 'type' | 'supportingPosition' | 'visible'> {
    containerHeight?: number;
    containerPageX?: number;
    containerPageY?: number;
    containerWidth?: number;
    layoutHeight?: number;
    layoutWidth?: number;
}

type InnerProps = Pick<RenderProps, 'type' | 'supportingPosition'>;
export const Container = styled(Shape)<ContainerProps>`
    overflow: hidden;
    position: absolute;
    z-index: 16384;

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
                top: ${containerPageY - layoutHeight - theme.adaptSize(theme.spacing.extraSmall)}px;
            `,
            verticalEnd: css`
                left: ${containerPageX + containerWidth / 2}px;
                top: ${containerPageY +
                containerHeight +
                theme.adaptSize(theme.spacing.extraSmall)}px;
            `,
            horizontalStart: css`
                left: ${containerPageX - layoutWidth - theme.adaptSize(theme.spacing.extraSmall)}px;
                top: ${containerPageY + containerHeight / 2}px;
            `,
            horizontalEnd: css`
                left: ${containerPageX +
                containerWidth +
                theme.adaptSize(theme.spacing.extraSmall)}px;

                top: ${containerPageY + containerHeight / 2}px;
            `,
        };

        return supportingPosition[position];
    }}

    ${({visible = false}) =>
        !visible &&
        css`
            pointer-events: none;
            z-index: -16384;
        `}
`;

export const Inner = styled(Pressable)<InnerProps>`
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
