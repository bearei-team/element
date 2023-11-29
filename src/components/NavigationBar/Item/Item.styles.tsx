import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../../Common/Common.styles';

export const Container = styled.Pressable`
    align-items: center;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;

    ${({theme}) => css`
        padding-block-end: ${theme.adaptSize(theme.spacing.medium)}px;
        padding-block-start: ${theme.adaptSize(theme.spacing.medium - theme.spacing.extraSmall)}px;
        gap: ${theme.adaptSize(theme.spacing.extraSmall)}px;
        min-width: ${theme.adaptSize(72)}px;
        min-height: ${theme.adaptSize(80)}px;
    `}
`;

export const IconContainer = styled.View`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;

    ${({theme}) => css`
        width: ${theme.adaptSize(24 + (theme.spacing.large - theme.spacing.extraSmall) * 2)}px;
    `}
`;

export const IconInner = styled(Shape)`
    ${({theme}) => css`
        padding-inline: ${theme.adaptSize(theme.spacing.large - theme.spacing.extraSmall)}px;
        padding-block: ${theme.adaptSize(theme.spacing.extraSmall)}px;
    `}
`;

export const Icon = styled(View)`
    ${({theme}) => css`
        height: ${theme.adaptSize(24)}px;
        width: ${theme.adaptSize(24)}px;
    `}
`;

export const LabelText = styled.Text`
    overflow: hidden;

    ${({theme}) => css`
        font-size: ${theme.adaptFontSize(theme.typography.label.medium.size)}px;
        font-style: ${theme.typography.label.medium.style};
        letter-spacing: ${theme.adaptSize(theme.typography.label.medium.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.label.medium.lineHeight)}px;
    `}
`;
