import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape, Typography} from '../../Common/Common.styles';
import {RenderProps} from './ListItemBase';

type ContainerProps = Pick<RenderProps, 'gap'>;
type ContentProps = {
    supportingTextShow?: boolean;
} & Pick<RenderProps, 'size'>;

type InnerProps = Pick<RenderProps, 'size'>;
type LeadingProps = Pick<RenderProps, 'size'>;

export const Container = styled(View)<ContainerProps>`
    overflow: hidden;
    display: flex;
    flex-direction: row;

    ${({gap = 0}) => css`
        padding-bottom: ${gap}px;
    `};

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.small)}px;
    `};
`;

export const AddonBefore = styled(Shape)`
    align-items: center;
    align-self: stretch;
    display: flex;
    flex-direction: row;
    justify-content: center;
    overflow: hidden;
`;

export const AddonAfter = styled(AddonBefore)``;

export const Background = styled(Shape)`
    flex: 1;

    ${({theme}) => css`
        background-color: ${theme.palette.surface.surface};
    `};
`;

export const Inner = styled.View<InnerProps>`
    align-items: flex-start;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: relative;
    z-index: 1;

    ${({theme, size = 'medium'}) => {
        const contentSize = {
            small: css`
                gap: ${theme.adaptSize(theme.spacing.small)}px;
                padding: ${theme.adaptSize(theme.spacing.none)}px
                    ${theme.adaptSize(theme.spacing.medium)}px;

                min-height: ${theme.adaptSize(theme.spacing.extraLarge)}px;
                align-items: center;
                height: ${theme.adaptSize(theme.spacing.small * 5)}px;
            `,
            medium: css`
                gap: ${theme.adaptSize(theme.spacing.medium)}px;
                padding: ${theme.adaptSize(theme.spacing.small)}px
                    ${theme.adaptSize(theme.spacing.medium)}px;

                min-height: ${theme.adaptSize(theme.spacing.small * 7)}px;
            `,
            large: css`
                gap: ${theme.adaptSize(theme.spacing.medium)}px;
                padding: ${theme.adaptSize(theme.spacing.small)}px
                    ${theme.adaptSize(theme.spacing.medium)}px;

                min-height: ${theme.adaptSize(theme.spacing.small * 9)}px;
            `,
        };

        return contentSize[size];
    }}
`;

export const Leading = styled.View<LeadingProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;

    ${({theme, size = 'medium'}) => {
        const contentSize = {
            small: css`
                height: ${theme.adaptSize(theme.spacing.large)}px;
                width: ${theme.adaptSize(theme.spacing.large)}px;
            `,
            medium: css`
                min-height: ${theme.adaptSize(theme.spacing.small * 5)}px;
                min-width: ${theme.adaptSize(theme.spacing.small * 5)}px;
            `,
            large: css`
                min-height: ${theme.adaptSize(theme.spacing.small * 7)}px;
                min-width: ${theme.adaptSize(theme.spacing.small * 7)}px;
            `,
        };

        return contentSize[size];
    }}
`;

export const Content = styled.View<ContentProps>`
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-self: stretch;

    ${({theme, size = 'medium', supportingTextShow}) => {
        const contentSize = {
            small: css``,
            medium:
                supportingTextShow &&
                css`
                    min-height: ${theme.adaptSize(theme.spacing.small * 7)}px;
                `,
            large:
                supportingTextShow &&
                css`
                    min-height: ${theme.adaptSize(theme.spacing.small * 7)}px;
                `,
        };

        return contentSize[size];
    }}
`;

export const Trailing = styled(Leading)`
    ${({theme, size = 'medium'}) => {
        const contentSize = {
            small: css`
                height: ${theme.adaptSize(theme.spacing.large)}px;
                width: ${theme.adaptSize(theme.spacing.large)}px;
            `,
            medium: css`
                min-height: ${theme.adaptSize(theme.spacing.small * 5)}px;
                min-width: ${theme.adaptSize(theme.spacing.small * 5)}px;
            `,
            large: css`
                min-height: ${theme.adaptSize(theme.spacing.small * 7)}px;
                min-width: ${theme.adaptSize(theme.spacing.small * 7)}px;
            `,
        };

        return contentSize[size];
    }}
`;

export const Headline = styled(Typography)`
    ${({theme}) => css`
        color: ${theme.palette.surface.onSurface};
    `}
`;

export const SupportingText = styled(Typography)`
    ${({theme}) => css`
        color: ${theme.palette.surface.onSurfaceVariant};
        height: auto;
    `}
`;
