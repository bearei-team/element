import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Typography} from '../../Common/Common.styles';

export interface ContentProps {
    supportingTextShow?: boolean;
}

export const Container = styled(View)`
    overflow: hidden;
`;

export const Inner = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: relative;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.medium)}px;
        padding: ${theme.adaptSize(theme.spacing.small)}px
            ${theme.adaptSize(theme.spacing.medium)}px;

        min-height: ${theme.adaptSize(theme.spacing.small * 7)}px;
    `};
`;

export const Leading = styled.View`
    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.small * 5)}px;
        width: ${theme.adaptSize(theme.spacing.small * 5)}px;
    `}
`;

export const Content = styled.View<ContentProps>`
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;

    ${({supportingTextShow, theme}) =>
        supportingTextShow &&
        css`
            min-height: ${theme.adaptSize(theme.spacing.small * 7)}px;
        `}
`;

export const Trailing = styled(Leading)``;
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
