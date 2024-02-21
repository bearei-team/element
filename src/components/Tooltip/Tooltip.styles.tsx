import styled, {css} from 'styled-components/native';
import {Shape, Typography} from '../Common/Common.styles';
import {RenderProps} from './TooltipBase';

export interface ContentProps extends Pick<RenderProps, 'type'> {
    height: number;
    width: number;
}

export const Container = styled.View`
    position: relative;
`;

export const Content = styled(Shape)<ContentProps>`
    position: absolute;

    ${({theme, height = 0}) => css`
        left: 50%;
        min-width: ${theme.adaptSize(theme.spacing.small * 8)}px;
        top: ${-(height + theme.adaptSize(theme.spacing.extraSmall))}px;
        z-index: 1024;
    `}

    ${({theme, type = 'plain'}) => {
        const contentType = {
            plain: css`
                background-color: ${theme.palette.inverse.inverseSurface};
                min-height: ${theme.adaptSize(theme.spacing.large)}px;
                padding: ${theme.adaptSize(theme.spacing.extraSmall)}px
                    ${theme.adaptSize(theme.spacing.small)}px;
            `,
            rich: css``,
        };

        return contentType[type];
    }}
`;

export const ContentInner = styled.Pressable``;
export const SupportingText = styled(Typography)`
    text-align: center;
    user-select: none;

    ${({theme}) => css`
        color: ${theme.palette.inverse.inverseOnSurface};
    `}
`;
