import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';

export const Container = styled(Shape)`
    ${({theme}) => css`
        background-color: ${theme.palette.scrim.scrim};
        height: 100%;
        width: 100%;
    `}
`;

export const Inner = styled.View`
    position: absolute;
    right: 0;
    top: 0;

    ${({theme}) => css`
        background-color: ${theme.palette.surface.surfaceContainerLow};
        height: 100%;
        width: ${theme.adaptSize(theme.spacing.small * 40)}px;
    `}
`;

export const Header = styled.View`
    display: flex;

    ${({theme}) => css`
        min-height: ${theme.adaptSize(theme.spacing.small * 9 + theme.spacing.extraSmall)}px;
        padding: ${theme.adaptSize(theme.spacing.medium - theme.spacing.extraSmall)}px
            ${theme.adaptSize(theme.spacing.medium - theme.spacing.extraSmall)}px
            ${theme.adaptSize(theme.spacing.medium)}px
            ${theme.adaptSize(theme.spacing.extraSmall)}px;
    `}
`;

export const HeadlineText = styled.Text`
    ${({theme}) => css`
        color: ${theme.palette.surface.onSurfaceVariant};
        font-size: ${theme.adaptFontSize(theme.typography.title.large.size)}px;
        font-style: ${theme.typography.title.large.style};
        font-weight: ${theme.typography.title.large.weight};
        letter-spacing: ${theme.adaptSize(theme.typography.title.large.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.title.large.lineHeight)}px;
    `}
`;

export const Icon = styled.View`
    overflow: hidden;

    ${({theme}) => css`
        width: ${theme.adaptSize(theme.spacing.small * 6)}px;
        height: ${theme.adaptSize(theme.spacing.small * 6)}px;
    `}
`;

export const BackAffordance = styled(Icon)``;
export const CloseAffordance = styled(Icon)``;

export const Content = styled.ScrollView`
    flex: 1;
`;

export const Button = styled.View`
    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.small * 6)}px;
    `}
`;

export const PrimaryButton = styled(Button)``;
export const SecondaryButton = styled(Button)``;

export const Footer = styled.View`
    ${({theme}) => css`
        min-height: ${theme.adaptSize(theme.spacing.small * 7)}px;
    `}
`;
