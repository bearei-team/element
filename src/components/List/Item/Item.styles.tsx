import {View} from 'react-native';
import styled, {css} from 'styled-components/native';

export const Container = styled(View)`
    overflow: hidden;
`;

export const Inner = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.medium)}px;
        padding: ${theme.adaptSize(theme.spacing.small)}px
            ${theme.adaptSize(theme.spacing.medium)}px;

        min-height: ${theme.adaptSize(56)}px;
    `};
`;

export const Leading = styled.View`
    ${({theme}) => css`
        max-width: ${theme.adaptSize(40)}px;
        max-height: ${theme.adaptSize(40)}px;
    `}
`;

export const Content = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: center;

    ${({theme}) => css`
        min-height: ${theme.adaptSize(56)}px;
    `};
`;

export const Trailing = styled(Leading)``;
export const Headline = styled.Text`
    ${({theme}) => css`
        color: ${theme.palette.surface.onSurface};
        font-size: ${theme.adaptFontSize(theme.typography.body.large.size)}px;
        font-style: ${theme.typography.body.large.style};
        font-weight: ${theme.typography.body.large.weight};
        letter-spacing: ${theme.adaptSize(theme.typography.body.large.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.body.large.lineHeight)}px;
    `}
`;

export const SupportingText = styled.Text`
    ${({theme}) => css`
        color: ${theme.palette.surface.onSurfaceVariant};
        font-size: ${theme.adaptFontSize(theme.typography.body.medium.size)}px;
        font-style: ${theme.typography.body.medium.style};
        font-weight: ${theme.typography.body.medium.weight};
        letter-spacing: ${theme.adaptSize(theme.typography.body.medium.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.body.medium.lineHeight)}px;
    `}
`;
