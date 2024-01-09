import styled, {css} from 'styled-components/native';
import {Shape, Typography} from '../Common/Common.styles';
import {RenderProps} from './BadgeBase';

export type ContainerProps = Pick<RenderProps, 'size'>;

export const Container = styled(Shape)<ContainerProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;

    ${({theme}) => css`
        background-color: ${theme.palette.error.error};
    `}

    ${({theme, size = 'medium'}) => {
        const containerSize = {
            large: css`
                height: ${theme.adaptSize(theme.spacing.medium)}px;
                min-width: ${theme.adaptSize(theme.spacing.medium)}px;
                padding: ${theme.adaptSize(theme.spacing.none)}px
                    ${theme.adaptSize(theme.spacing.extraSmall)}px;
            `,

            medium: css`
                height: ${theme.adaptSize(theme.spacing.medium)}px;
                min-width: ${theme.adaptSize(theme.spacing.medium)}px;
                padding: ${theme.adaptSize(theme.spacing.none)}px
                    ${theme.adaptSize(theme.spacing.extraSmall)}px;
            `,

            small: css`
                width: ${theme.adaptSize(theme.spacing.small - 2)}px;
                height: ${theme.adaptSize(theme.spacing.small - 2)}px;
                padding: ${theme.adaptSize(theme.spacing.extraSmall - 2)}px;
            `,
        };

        return containerSize[size];
    }}
`;

export const LabelText = styled(Typography)`
    ${({theme}) => css`
        color: ${theme.palette.error.onError};
    `}
`;
