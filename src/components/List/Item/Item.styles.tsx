import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {RenderProps} from './ItemBase';

export type MainProps = Pick<RenderProps, 'state'>;

export const Container = styled(View)`
    width: 100%;
    overflow: hidden;
`;

export const Main = styled.View<MainProps>`
    align-items: center;
    display: inline-flex;
    flex-direction: row;
    justify-content: space-between;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.medium)}px;
        padding: ${theme.adaptSize(theme.spacing.small)}px
            ${theme.adaptSize(theme.spacing.medium)}px;
    `};
`;

export const Leading = styled.View`
    ${({theme}) => css`
        max-width: ${theme.adaptSize(40)}px;
        max-height: ${theme.adaptSize(40)}px;
    `}
`;

export const Content = styled.View`
    flex: 1;
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
